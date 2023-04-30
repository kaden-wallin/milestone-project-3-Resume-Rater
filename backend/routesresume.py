# Imports
from flask import Blueprint, jsonify, request
from models import Resumes
from database import session
from datetime import datetime
from docx import Document
from utils import token_required
import fitz
import tempfile
import chardet
import base64
import os

resume_bp = Blueprint('resume', __name__)

def allowed_file(filename, allowed_extensions):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

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

@resume_bp.route('/api/upload-resume', methods=['POST'])
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
                with fitz.open(f) as pdf:
                    pdf_text = ""
                    for page in pdf:
                        pdf_text += page.get_text()
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

@resume_bp.route('/api/download-resume/<int:resume_id>', methods=['GET'])
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

@resume_bp.route('/api/search-resumes', methods=['GET'])
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