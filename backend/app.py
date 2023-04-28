# Imports
from flask import Flask, make_response, jsonify, request, redirect, url_for
from flask_migrate import Migrate
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, verify_jwt_in_request, get_jwt_identity
from models import Users, Passwords, Resumes, CommentsAndRatings
from database import session
from datetime import datetime, timedelta
from dotenv import load_dotenv
from functools import wraps
import secrets
import os
import argon2
import base64

load_dotenv()

# Configuration
app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SUPABASE_URI")
app.config['JWT_SECRET_KEY'] = os.getenv("SECRET_KEY")
jwt = JWTManager(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

argon2_hasher = argon2.PasswordHasher()

def allowed_file(filename, allowed_extensions):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        current_user = session.query(Users).filter_by(user_id=user_id).first()
        return f(current_user, *args, **kwargs)
    return decorated

# Login routes
# Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    if not isinstance(data['username'], str) or not isinstance(data['email'], str) or not isinstance(data['password'], str):
        return jsonify({'error': 'Invalid field types'}), 400

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if session.query(Users).filter_by(email=email).first() is not None:
        return jsonify({'error': 'Email address already in use'}), 400

    salt = secrets.token_hex(16)
    hashed_password = argon2.hash(password + salt)
    user = Users(username=username, email=email)
    session.add(user)
    session.commit()

    password = Passwords(salt=salt, password=hashed_password, user_id_fkey=user.user_id)
    session.add(password)
    
    session.commit()
    
    access_token = create_access_token(identity=user.user_id)
    response = jsonify({'user': {
        'user_id': user.user_id,
        'username': user.username,
        'email': user.email,
        'access_token': access_token
    }})

    response.set_cookie('access_token_cookie', access_token)
    response.headers['Access-Control-Expose-Headers'] = 'Set-Cookie'
    return response

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    email = data.get('email')
    password = data.get('password')

    user = session.query(Users).filter_by(email=email).first()

    if user is None:
        return jsonify({'error': 'Invalid email or password'}), 401

    password_data = session.query(Passwords).filter_by(user_id_fkey=user.user_id).first()
    salt = password_data.salt
    hashed_password = password_data.password

    if argon2.verify(password + salt, hashed_password):
        access_token = create_access_token(identity=user.user_id)
        response = jsonify({'user': {
            'user_id': user.user_id,
            'username': user.username,
            'email': user.email,
            'access_token': access_token
        }})

        response.set_cookie('access_token_cookie', access_token)
        response.headers['Access-Control-Expose-Headers'] = 'Set-Cookie'
        return response
    else:
        return jsonify({'error': 'Invalid email or password'}), 401


@app.route('/logout')
def logout():
    response = make_response(jsonify({'message': 'Logged out successfully'}))
    response.set_cookie('access_token_cookie', '', expires=0)
    response.headers['Access-Control-Expose-Headers'] = 'Set-Cookie'
    return response


# Everything passed this point is resume routes
@app.route('/upload-resume', methods=['POST'])
@token_required
def upload_resume(current_user):
    if 'resume' not in request.files:
        return jsonify({'error': 'No file in request'}), 400

    resume_file = request.files['resume']
    if resume_file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    allowed_extensions = {'pdf', 'doc', 'docx', 'txt'}
    if not allowed_file(resume_file.filename, allowed_extensions):
        return jsonify({'error': 'Invalid file type'}), 400

    # Create a new instance of the Resumes model and set its attributes
    resume = Resumes()
    resume.user_id_fkey = current_user.user_id
    resume.uploaded_at = datetime.utcnow()
    resume.filename = f"{current_user.user_id}_resume_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{resume_file.filename}"
    resume.content_type = resume_file.content_type
    resume.file_data = resume_file.read()

    session.add(resume)
    session.commit()

    return jsonify({'success': 'Resume uploaded successfully'}), 200

@app.route('/search', methods=['GET'])
def search_resumes():
    term = request.args.get('term')

    if not term:
        return jsonify({'error': 'Missing search term'}), 400

    search_results = Resumes.query.filter(Resumes.resume.ilike(f'%{term}%')).all()

    return jsonify([{'resume_id': resume.resume_id, 'resume': resume.resume} for resume in search_results])

@app.route('/resumes/<int:resume_id>', methods=['GET'])
def get_resume(resume_id):
    resume = Resumes.query.filter_by(resume_id=resume_id).first()

    if not resume:
        return jsonify({'error': 'Resume not found'}), 404

    return make_response(resume.resume, {'Content-Type': 'application/pdf'})

@app.route('/resumes/<int:resume_id>/comments', methods=['GET'])
def get_resume_comments(resume_id):
    comments = CommentsAndRatings.query.filter_by(resume_id_fkey=resume_id).with_entities(CommentsAndRatings.comment).all()
    comments_list = [c[0] for c in comments]
    return jsonify({'comments': comments_list}), 200

@app.route('/resumes/<int:resume_id>/ratings', methods=['GET'])
def get_resume_ratings(resume_id):
    ratings = CommentsAndRatings.query.filter_by(resume_id_fkey=resume_id).with_entities(CommentsAndRatings.rating).all()
    ratings_list = [r[0] for r in ratings]
    return jsonify({'ratings': ratings_list}), 200

@app.route('/resumes/<int:resume_id>/feedback', methods=['POST'])
def add_comment_and_rating(resume_id):
    comment = request.json.get('comment')
    rating = request.json.get('rating')

    new_c_and_r = CommentsAndRatings(comment=comment, rating=rating, resume_id_fkey=resume_id)
    session.add(new_c_and_r)
    session.commit()

    return jsonify({'success': True}), 201

@app.route('/resumes/<int:resume_id>/feedback', methods=['GET'])
def get_comments_and_ratings(resume_id):

    c_and_rs = CommentsAndRatings.query.filter_by(resume_id_fkey=resume_id).all()

    c_and_rs_list = [{'comment': c_and_r.comment, 'rating': c_and_r.rating} for c_and_r in c_and_rs]

    return jsonify(c_and_rs_list), 200

if __name__ == '__main__':
    app.run()