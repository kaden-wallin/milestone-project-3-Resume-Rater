# Imports
from io import BytesIO
from flask import Blueprint, make_response, jsonify, request
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
import fitz
import tempfile
import chardet
import base64
import os

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
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

@auth_bp.route('/login', methods=['POST'])
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


@auth_bp.route('/logout')
def logout():
    response = make_response(jsonify({'message': 'Logged out successfully'}))
    response.set_cookie('access_token_cookie', '', expires=0)
    response.headers['Access-Control-Expose-Headers'] = 'Set-Cookie'
    return response