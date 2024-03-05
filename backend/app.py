from flask import Flask, send_from_directory, send_file, request, jsonify
app = Flask(__name__,
            static_url_path='../frontend',
            static_folder='../frontend/build')

@app.route('/')
def home():
    return send_from_directory('build', 'index.html')