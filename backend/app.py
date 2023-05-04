# Imports
from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from routesauthorization import auth_bp
from routesresume import resume_bp
from routesfeedback import feedback_bp
import os

CORS_URL = os.getenv("CORS_URL")

load_dotenv()

# Configuration
app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SUPABASE_URI")
app.config['JWT_SECRET_KEY'] = os.getenv("SECRET_KEY")
jwt = JWTManager(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

app.register_blueprint(auth_bp)
app.register_blueprint(resume_bp)
app.register_blueprint(feedback_bp)

if __name__ == '__main__':
    app.run(debug=True)