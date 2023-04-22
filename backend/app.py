from flask import Flask, jsonify, request
from supabase import create_client

app = Flask(__name__)

supabase_url = 'https://osdspxwxczwrzekvdjuc.supabase.co'
supabase_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zZHNweHd4Y3p3cnpla3ZkanVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODIxMzUzMDksImV4cCI6MTk5NzcxMTMwOX0.MYO-qLqZOh9bmVpeK3ZDi03TAJ31Z6R1TtrpJmZgnbE'

supabase_client = create_client(supabase_url, supabase_key)

@app.route('/api/data')
def get_data():
    data = {'name': 'John Doe', 'age': 30}
    if request.method == 'GET':
        return jsonify(data)
    
result = supabase_client.from_('comments').select('*').execute()