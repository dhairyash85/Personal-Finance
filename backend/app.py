from flask import Flask, send_from_directory, send_file, request, jsonify
import mysql.connector
from datetime import date
app = Flask(__name__)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email=data["email"]
    password=data['password']
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="dheerizz",
        database='Finance Tracker'
    )
    user = mydb.cursor()
    user.execute(f"SELECT * FROM users where email='{email}'")
    user=user.fetchall()
    if(not user):
        return jsonify({"success": False, "reason":"user does not exist"})
    elif(user[0][6] != password):
        return jsonify({"success": False, "reason":"Incorrect Password"})
    else:
        return jsonify({"success":True})

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email=data["email"]
    password=data['password']
    fname=data['fname']
    lname=data['lname']
    age=data['age']
    username=data['username']
    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            password="dheerizz",
            database='Finance Tracker'
        )
        user = mydb.cursor()
        user.execute(f"INSERT INTO users VALUE('{email}', '{fname}', '{lname}', '{username}', {age}, '{password}')")
        mydb.commit()
        return jsonify({"success": True})
    except KeyError:
        print(KeyError)
    except RuntimeError:
        print(RuntimeError)
        return jsonify({"success":False,"error":"An error occurred while trying to add the new user."})
    
@app.route('/api/addexpense', methods=['POST'])
def addExpense():
    data = request.get_json()
    amount=data['amount']
    fname=data['fname']
    username=data['username']
    current_date = date.today()
    print(current_date)
    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            password="dheerizz",
            database='Finance Tracker'
        )
        user = mydb.cursor()
        user.execute(f"INSERT INTO expenses VALUE('{username}', '{fname}', '{current_date}', {amount})")
        mydb.commit()
        return jsonify({"success": True})
    except KeyError:
        print(KeyError)
    except RuntimeError:
        print(RuntimeError)
        return jsonify({"success":False,"error":"An error occurred while trying to add the new user."})

@app.route('/api/returnexpense', methods=['POST'])
def returnExpense():
    data = request.get_json()
    username=data['username']
    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            password="dheerizz",
            database='Finance Tracker'
        )
        user = mydb.cursor()
        user.execute(f"SELECT * FROM expenses where username='{username}'")
        user=user.fetchall()
        print(user)
        return jsonify({"expenses": user})
    except KeyError:
        print(KeyError)
    except RuntimeError:
        print(RuntimeError)
        return jsonify({"success":False,"error":"An error occurred while trying to add the new user."})


if __name__=='__main__':
    app.run(debug=True)