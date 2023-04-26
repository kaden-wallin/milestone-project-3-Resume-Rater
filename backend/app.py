# Imports
from flask import Flask, jsonify, request, redirect, url_for
from flask_migrate import Migrate
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, current_user, login_user, logout_user, login_required
from models import Users, Passwords, UserToken
from database import session
from datetime import datetime, timedelta
from dotenv import load_dotenv
import secrets
import os
import bcrypt
import json

load_dotenv()

# Configuration
app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SUPABASE_URI")
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Login Configuration
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return session.query(Users).get(int(user_id))

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

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    passwords = Passwords(password=hashed_password, user_id_fkey=user.user_id)
    session.add(passwords)

    token = UserToken(user=user, token=secrets.token_urlsafe())
    session.add(token)

    session.commit()

    return jsonify({'user': user.__dict__()})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password_str = data.get('password')

    user = session.query(Users).filter_by(email=email).first()
    print(user)

    if user:
        password_obj = session.query(Passwords).filter_by(user_id_fkey=user.user_id).first()
        print(password_obj)

    if password_obj:
        password = password_obj.password
    else:
        return jsonify({'error': 'Invalid email or password'}), 401

    if password and bcrypt.checkpw(password_str.encode('utf-8'), password.encode('utf-8')):
        user_token = user.user_token

        if user_token.expires_at < datetime.utcnow():
            return jsonify({'error': 'Token has expired'}), 401

        login_user(user)

        return jsonify({'token': user_token.token, 'expires_at': user_token.expires_at})

    return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)