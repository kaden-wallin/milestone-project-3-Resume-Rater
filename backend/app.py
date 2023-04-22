from flask import Flask, jsonify, request
from backend.models import Users
from database import session
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SUPABASE_URI")

@app.route('/api/data')
def get_data():
    users = session.query(Users).all()
    data = {'users': [users.username for user in users]}
    return jsonify(data)
    