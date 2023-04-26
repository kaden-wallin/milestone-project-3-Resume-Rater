# Imports
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime, timedelta

# Models For Database
Base = declarative_base()

class Users(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)

    def is_active(self):
        return True
    
    def get_id(self):
        return self.user_id
    
class Passwords(Base):
    __tablename__ = 'passwords'
    
    password_id = Column(Integer, primary_key=True)
    password = Column(Text)
    user_id_fkey = Column(Integer, ForeignKey('users.user_id'))
    user = relationship('Users', backref='passwords')

class UserToken(Base):
    __tablename__ = 'user_tokens'

    token_id = Column(Integer, primary_key=True)
    token = Column(String(80), unique=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False, default=datetime.utcnow() + timedelta(days=1))
    user_id_fkey = Column(Integer, ForeignKey('users.user_id'))
    user = relationship('Users', backref='user_token')

class Resumes(Base):
    __tablename__ = 'resumes'

    resume_id = Column(Integer, primary_key=True)
    resume = Column(Text)
    user_id_fkey = Column(Integer, ForeignKey('users.user_id'))
    user = relationship('Users', backref='resumes')
    
    
class CommentsAndRatings(Base):
    __tablename__ = 'comments_and_ratings'

    c_and_r_id = Column(Integer, primary_key=True)
    comment = Column(Text)
    rating = Column(Integer, nullable=True, default=0,
                        info={'check_constraint': 'rating >= 1 AND rating <= 5'})
    user_id_fkey = Column(Integer, ForeignKey('users.user_id'), nullable=True)
    resume_id_fkey = Column(Integer, ForeignKey('resumes.resume_id'), nullable=False)
    user = relationship('Users', backref='comments_and_ratings')
    resume = relationship('Resumes', backref='comments_and_ratings')
