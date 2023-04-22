from supabase import create_client
from sqlalchemy import Table, Column, Integer, String
from models import Base, Users, Resumes, CommentsAndRatings, UserToken
from dotenv import load_dotenv
import os

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase_client = create_client(supabase_url, supabase_key)

models = [Users, Resumes, CommentsAndRatings, UserToken]

for model in models:
    table_name = model.__tablename__
    columns = [Column(col_name, col_type) for col_name, col_type in model.__table__.columns.items()]
    table = Table(table_name, Base.metadata, *columns)
    table.create(supabase_client.engine)