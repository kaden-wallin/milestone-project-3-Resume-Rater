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

load_dotenv()

# Configuration
app = Flask(__name__)
CORS(app, origins=['https://rotten-resumes-frontend.vercel.app', 'http://rotten-resumes-frontend.vercel.app', 'http://localhost:3000'])
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SUPABASE_URI")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_pre_ping': True}
app.config['JWT_SECRET_KEY'] = os.getenv("SECRET_KEY")

jwt = JWTManager(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Stopping the SSL error
def cleanup_app_context(response_or_exc):
    db.session.close()
    db.engine.dispose()
    return response_or_exc

@app.after_request
def after_request(response):
    return cleanup_app_context(response)

@app.teardown_appcontext
def teardown_appcontext(exception=None):
    return cleanup_app_context(None)


# Routes
app.register_blueprint(auth_bp)
app.register_blueprint(resume_bp)
app.register_blueprint(feedback_bp)

if __name__ == '__main__':
    app.run()