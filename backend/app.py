from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/api/data')
def get_data():
    data = {'name': 'John Doe', 'age': 30}
    if request.method == 'GET':
        return jsonify(data)