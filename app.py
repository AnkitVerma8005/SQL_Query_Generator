from flask import Flask, render_template, request, jsonify
from utils.llm_service import generate_sql
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    query = data.get('query')
    
    if not query:
        return jsonify({'error': 'No query provided'}), 400
    
    result = generate_sql(query)
    
    if result == "NOT_RELEVANT":
         return jsonify({'error': 'Please ask a relevant SQL question.'}), 400
         
    return jsonify({'sql': result})

if __name__ == '__main__':
    app.run(debug=True)
