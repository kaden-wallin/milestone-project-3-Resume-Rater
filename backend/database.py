# Imports
from supabase import create_client
from sqlalchemy import Table, Column, Integer, String, DATETIME, create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import BYTEA, INTEGER, TEXT, VARCHAR
from models import Base, Users, Resumes, CommentsAndRatings, UserToken
from dotenv import load_dotenv
import os

load_dotenv()

# Supabase Components
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase_uri = os.getenv("SUPABASE_URI")
supabase_client = create_client(supabase_url, supabase_key)

# Database Connection
engine = create_engine(supabase_uri)
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

# Database Migration
for model in [Users, Resumes, CommentsAndRatings, UserToken]:
    columns = []
    for col_name, col_type in model.__table__.columns.items():
        column_type = str(col_type.type)
        column_type = eval(column_type)
        columns.append(Column(col_name, column_type))
    table_name = model.__tablename__