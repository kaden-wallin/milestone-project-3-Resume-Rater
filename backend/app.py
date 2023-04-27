# Imports
from flask import Flask, make_response, jsonify, request, redirect, url_for
from flask_migrate import Migrate
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, current_user, login_user, logout_user, login_required
from models import Users, Passwords, UserToken, Resumes, CommentsAndRatings
from database import session
from datetime import datetime, timedelta
from dotenv import load_dotenv
from functools import wraps
import secrets
import os
import argon2
import jwt
import base64

load_dotenv()

# Configuration
app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SUPABASE_URI")
secret_key = os.getenv("SECRET_KEY")
app.secret_key = secret_key
db = SQLAlchemy(app)
migrate = Migrate(app, db)

argon2_hasher = argon2.PasswordHasher()

# Login Configuration
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

def load_user(user_id):
    if user_id:
        user = Users.query.get(int(user_id))
        if user:
            return user
    
    encoded_token = request.headers.get('Authorization')
    if encoded_token:
        try:
            token = jwt.decode(encoded_token, secret_key, algorithms=['HS256'])
            user = Users.query.get(token['user_id'])
            if user:
                return user
        except:
            pass
    
    return None

def jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        encoded_token = request.headers.get('Authorization')
        if not encoded_token:
            return jsonify({'error': 'Missing authorization token'}), 401
        try:
            token = jwt.decode(encoded_token, secret_key, algorithms=['HS256'])
            current_user = Users.query.get(token['user_id'])
            if not current_user:
                return jsonify({'error': 'Invalid token'}), 401
            return f(current_user=current_user, *args, **kwargs)
        except:
            return jsonify({'error': 'Invalid token'}), 401
    return decorated_function

def allowed_file(filename, allowed_extensions):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

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

    user = Users(username=username, email=email)
    session.add(user)
    session.commit()

    hashed_password = argon2_hasher.hash(password)
    encoded_password = base64.b64encode(hashed_password.encode('utf-8'))
    passwords = Passwords(password=encoded_password, user_id_fkey=user.user_id)
    session.add(passwords)

    token = UserToken(user=user, token=secrets.token_urlsafe())
    session.add(token)

    session.commit()
    
    token = jwt.encode({'user_id': user.user_id}, secret_key, algorithm='HS256')
    return jsonify({'user': {
        'user_id': user.user_id,
        'username': user.username,
        'email': user.email,
        'token': token
    }})

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

    encoded_password = session.query(Passwords).filter_by(user_id_fkey=user.user_id).first().password
    decoded_password = base64.b64decode(encoded_password.encode('utf-8'))

    try:
        argon2_hasher.verify(decoded_password, password)
    except argon2.exceptions.VerifyMismatchError:
        return jsonify({'error': 'Invalid email or password'}), 401

    login_user(user)

    token = UserToken(user=user, token=secrets.token_urlsafe(), expires_at=datetime.utcnow() + timedelta(hours=1))
    session.add(token)
    session.commit()

    token = jwt.encode({'user_id': user.user_id}, secret_key, algorithm='HS256')
    response = jsonify({'user': {
        'user_id': user.user_id,
        'username': user.username,
        'email': user.email,
        'token': token
    }})
    response.set_cookie('token', token)
    response.headers['Access-Control-Expose-Headers'] = 'Set-Cookie'
    return response

@app.route('/logout')
@login_required
def logout():
    response = make_response(jsonify({'message': 'Logged out successfully'}))
    response.set_cookie('token', '', expires=0)
    response.headers['Access-Control-Expose-Headers'] = 'Set-Cookie'
    logout_user()
    return response

@app.route('/upload-resume', methods=['POST'])
@jwt_required
def upload_resume(current_user):
    if 'resume' not in request.files:
        return jsonify({'error': 'No file in request'}), 400

    resume_file = request.files['resume']
    if resume_file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    allowed_extensions = {'pdf', 'doc', 'docx', 'txt'}
    if not allowed_file(resume_file.filename, allowed_extensions):
        return jsonify({'error': 'Invalid file type'}), 400

    filename = f"{current_user.user_id}_resume_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{resume_file.filename}"
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    resume_file.save(file_path)

    resume = Resumes(user_id_fkey=current_user.user_id, file_path=file_path)
    session.add(resume)
    session.commit()

    return jsonify({'message': 'Resume uploaded successfully'}), 200

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
    db.session.add(new_c_and_r)
    db.session.commit()

    return jsonify({'success': True}), 201

@app.route('/resumes/<int:resume_id>/feedback', methods=['GET'])
def get_comments_and_ratings(resume_id):

    c_and_rs = CommentsAndRatings.query.filter_by(resume_id_fkey=resume_id).all()

    c_and_rs_list = [{'comment': c_and_r.comment, 'rating': c_and_r.rating} for c_and_r in c_and_rs]

    return jsonify(c_and_rs_list), 200

if __name__ == '__main__':
    app.run()