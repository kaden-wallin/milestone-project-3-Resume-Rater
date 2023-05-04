# Imports
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import BYTEA
from sqlalchemy.orm import relationship, declarative_base

# Models For Database
Base = declarative_base()

class Users(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    
class Passwords(Base):
    __tablename__ = 'passwords'
    
    password_id = Column(Integer, primary_key=True)
    password = Column(Text)
    salt = Column(Text)
    user_id_fkey = Column(Integer, ForeignKey('users.user_id'))
    user = relationship('Users', backref='passwords')

class Resumes(Base):
    __tablename__ = 'resumes'

    resume_id = Column(Integer, primary_key=True)
    filename = Column(String(255))
    resume = Column(BYTEA)
    resume_content = Column(Text)
    content_type = Column(String(255))
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
