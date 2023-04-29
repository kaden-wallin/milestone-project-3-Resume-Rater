# Imports
from io import BytesIO
from flask import Flask, make_response, jsonify, request, redirect, send_file, url_for
from flask_migrate import Migrate
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, verify_jwt_in_request, get_jwt_identity
from models import Users, Passwords, Resumes, CommentsAndRatings
from database import session
from datetime import datetime, timedelta
from dotenv import load_dotenv
from docx import Document
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import PyPDF2
import tempfile
import chardet
import base64
import os


load_dotenv()

# Configuration
app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SUPABASE_URI")
app.config['JWT_SECRET_KEY'] = os.getenv("SECRET_KEY")
jwt = JWTManager(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

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

def get_content_type(extension):
    if extension == 'pdf':
        return 'application/pdf'
    elif extension == 'doc':
        return 'application/msword'
    elif extension == 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    elif extension == 'txt':
        return 'text/plain'
    else:
        return 'application/octet-stream'

# Login routes
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

    hashed = generate_password_hash(password)
    user = Users(username=username, email=email)
    session.add(user)
    session.commit()

    password = Passwords(password=hashed, user_id_fkey=user.user_id)
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

    hashed_password = password_data.password

    if check_password_hash(hashed_password, password):
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

    allowed_extensions = {'pdf', 'doc', 'docx'}
    if not allowed_file(resume_file.filename, allowed_extensions):
        return jsonify({'error': 'Invalid file type'}), 400

    resume = Resumes()
    resume.user_id_fkey = current_user.user_id
    resume.filename = f"{current_user.username}_resume_{datetime.utcnow()}_{resume_file.filename}"

    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        resume_file.save(temp_file.name)
        temp_file.flush()
        os.fsync(temp_file.fileno())
        with open(temp_file.name, 'rb') as f:
            content = f.read()
            result = chardet.detect(content)
            encoding_type = result['encoding'] if result['encoding'] is not None else 'utf-8'
            file_extension = os.path.splitext(resume_file.filename)[1][1:].lower()
            content_type = get_content_type(file_extension)

            if file_extension == 'pdf':
                pdf_reader = PyPDF2.PdfReader(f)
                pdf_text = ""
                for page in pdf_reader.pages:
                    pdf_text += page.extract_text()
                resume.resume_content = pdf_text.lower().split()
            elif file_extension in ['doc', 'docx']:
                doc = Document(f)
                doc_text = ""
                for para in doc.paragraphs:
                    doc_text += para.text
                resume.resume_content = doc_text.lower().split()
            else:
                resume.resume_content = content.decode(encoding_type).lower().split()

        temp_file.seek(0)
        resume.resume = temp_file.read()
        resume.content_type = content_type

    session.add(resume)
    session.commit()

    return jsonify({'success': 'Resume uploaded successfully'}), 200

@app.route('/download-resume/<int:resume_id>', methods=['GET'])
def download_resume(resume_id):
    resume = session.query(Resumes).filter_by(resume_id=resume_id).first()
    if resume is None:
        return jsonify({'error': 'Resume not found'}), 404
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(resume.resume)
        with open(temp_file.name, 'rb') as f:
            file_content = f.read()

    content_type = get_content_type(resume.content_type)

    return jsonify({
        'url': f'data:{content_type};base64,{base64.b64encode(file_content).decode()}',
        'filename': resume.filename
    })

@app.route('/search-resumes', methods=['GET'])
def search_resumes():
    keyword = request.args.get('keyword').lower()
    if keyword is None:
        return jsonify({'error': 'Keyword parameter missing'}), 400

    resumes = session.query(Resumes).filter(Resumes.resume_content.ilike(f'%{keyword}%')).all()
    if len(resumes) == 0:
        return jsonify({'message': 'No matching resumes found'}), 200

    resume_list = []
    for resume in resumes:
        resume_dict = {
            'resume_id': resume.resume_id,
            'filename': resume.filename
        }
        resume_list.append(resume_dict)

    return jsonify({'resumes': resume_list}), 200

@app.route('/comments-and-ratings', methods=['POST'])
@token_required
def add_comment_and_rating(current_user):
    comment = request.json['comment']
    rating = request.json['rating']
    user_id_fkey = current_user.user_id
    resume_id = request.json['resumeId']

    new_comment_and_rating = CommentsAndRatings(
        comment=comment,
        rating=rating, 
        user_id_fkey=user_id_fkey,
        resume_id_fkey=resume_id
        )
    session.add(new_comment_and_rating)
    session.commit()

    return {'message': 'Comment and rating added successfully'}, 200

@app.route('/comments-and-ratings/<int:resume_id>')
def get_comments_and_ratings(resume_id):
    comments_and_ratings = session.query(CommentsAndRatings).filter_by(resume_id_fkey=resume_id).all()
    if comments_and_ratings:
        comments = [c.comment for c in comments_and_ratings]
        ratings = [c.rating for c in comments_and_ratings]
        return jsonify({'comments': comments, 'ratings': ratings})
    else:
        return jsonify({'error': f'Resume with ID {resume_id} not found'}), 404
