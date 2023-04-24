# Imports
from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from models import Users
from database import session
from dotenv import load_dotenv
import os

load_dotenv()

# Configuration
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SUPABASE_URI")
db = SQLAlchemy(app)
migrate = Migrate(app, db)

@app.route('/api/users')
def get_data():
        users = session.query(Users).all()
        data = {'username': users[0].username, 'email' : users[0].email}
        return jsonify(data)
    