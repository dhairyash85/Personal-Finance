from flask import Flask, request, jsonify, send_from_directory
import mysql.connector
from flask_cors import CORS, cross_origin
from datetime import date

app = Flask(__name__,
            static_url_path='/',
            static_folder='build/')

CORS(app, support_credentials=True)
@app.route('/')

def home():
    return send_from_directory('build', 'index.html')

@app.route('/api/login', methods=['POST'])

def login():
    data = request.get_json()
    email = data["email"]
    password = data['password']

    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="dheerizz",
        database='Finance Tracker'
    )

    user = mydb.cursor()
    user.execute(f"SELECT * FROM users where email='{email}'")
    user = user.fetchone()
    if not user:
        return jsonify({"success": False, "reason": "User does not exist"})
    elif user[6] != password:
        return jsonify({"success": False, "reason": "Incorrect Password"})
    else:
        
        response = jsonify({"success": True, "user":user})
        response.headers.add('Access-Control-Allow-Origin', '*')  
        return response

@app.route('/api/signup', methods=['POST'])

def signup():
    data = request.get_json()
    email = data["email"]
    password = data['password']
    fname = data['fname']
    lname = data['lname']
    age = data['age']
    username = data['username']

    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            password="dheerizz",
            database='Finance Tracker'
        )

        user = mydb.cursor()
        user.execute(f"INSERT INTO users(email, fname, lname, username, age, password) VALUE('{email}', '{fname}', '{lname}', '{username}', {age}, '{password}')")
        mydb.commit()

        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": "An error occurred while trying to add the new user."})

@app.route('/api/addexpense', methods=['POST'])

def addExpense():
    data = request.get_json()
    amount = data['amount']
    type = data['type']
    username = data['username']
    current_date = date.today()

    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            password="dheerizz",
            database='Finance Tracker'
        )

        user = mydb.cursor()
        user.execute(f"INSERT INTO expenses VALUE('{username}', '{type}', '{current_date}', {amount})")
        mydb.commit()
        response = jsonify({"success": True})
        response.headers.add('Access-Control-Allow-Origin', '*')  
        return response    
    except Exception as e:
        return jsonify({"success": False, "error": "An error occurred while trying to add the new expense."})

@app.route('/api/returnexpense', methods=['POST'])

def returnExpense():
    data = request.get_json()
    username = data['username']

    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            password="dheerizz",
            database='Finance Tracker'
        )

        user = mydb.cursor()
        user.execute(f"SELECT * FROM expenses where username='{username}'")
        user = user.fetchall()
        response = jsonify({"success": True, "expense":user})
        response.headers.add('Access-Control-Allow-Origin', '*')  
        return response    
    except Exception as e:
        return jsonify({"success": False, "error": "An error occurred while trying to retrieve the expenses."})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

