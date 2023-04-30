# Imports
from flask import Blueprint, jsonify, request
from models import Users, CommentsAndRatings
from database import session
from utils import token_required

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/api/comments-and-ratings', methods=['POST'])
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

@feedback_bp.route('/api/comments-and-ratings/<int:resume_id>')
def get_comments_and_ratings(resume_id):
    comments_and_ratings = (
        session.query(CommentsAndRatings, Users.username)
        .join(Users, Users.user_id == CommentsAndRatings.user_id_fkey)
        .filter(CommentsAndRatings.resume_id_fkey == resume_id)
        .all()
    )
    if comments_and_ratings:
        comments = [c[0].comment for c in comments_and_ratings]
        ratings = [c[0].rating for c in comments_and_ratings]
        usernames = [c[1] for c in comments_and_ratings]
        return jsonify({'comments': comments, 'ratings': ratings, 'usernames': usernames})
    else:
        return jsonify({'error': f'Resume with ID {resume_id} not found'}), 404