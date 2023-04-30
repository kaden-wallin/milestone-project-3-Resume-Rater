from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from database import session
from models import Users


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        current_user = session.query(Users).filter_by(user_id=user_id).first()
        return f(current_user, *args, **kwargs)
    return decorated