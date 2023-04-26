# Imports
from flask import Flask, jsonify, request, redirect, url_for
from flask_migrate import Migrate
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, current_user, login_user, logout_user, login_required
from models import Users, Passwords, UserToken, Resumes
from database import session
from datetime import datetime, timedelta
from dotenv import load_dotenv
import secrets
import os
import argon2
import json
import base64

load_dotenv()

# Configuration
app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SUPABASE_URI")
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
db = SQLAlchemy(app)
migrate = Migrate(app, db)

argon2_hasher = argon2.PasswordHasher()

# Login Configuration
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))

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
    encoded_password = base64.b64encode(hashed_password.encode('utf-8')).decode('utf-8')
    passwords = Passwords(password=encoded_password, user_id_fkey=user.user_id)
    session.add(passwords)

    token = UserToken(user=user, token=secrets.token_urlsafe())
    session.add(token)

    session.commit()

    return jsonify({'user': {
        'user_id': user.user_id,
        'username': user.username,
        'email': user.email
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
    decoded_password = base64.b64decode(encoded_password.encode('utf-8')).decode('utf-8')

    try:
        argon2_hasher.verify(decoded_password, password)
    except argon2.exceptions.VerifyMismatchError:
        return jsonify({'error': 'Invalid email or password'}), 401

    login_user(user)
    return jsonify({'user': {
        'user_id': user.user_id,
        'username': user.username,
        'email': user.email
    }})

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/upload-resume', methods=['POST'])
@login_required
def upload_resume():
    file = request.files['resume']
    user_id = current_user.user_id
    resume = Resumes(resume=file.read(), user_id_fkey=user_id)
    session.add(resume)
    session.commit()
    return jsonify({'message': 'Resume uploaded successfully'})

if __name__ == '__main__':
    app.run()