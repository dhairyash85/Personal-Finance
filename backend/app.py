from flask import Flask, request, jsonify, send_from_directory
import mysql.connector
from flask_cors import CORS, cross_origin
import matplotlib
matplotlib.use('Agg') 
import matplotlib.pyplot as plt
from datetime import date
import io
import base64
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from joblib import dump, load  # Import joblib for model persistence
from model import load_data, train_models
# print("MODELSS",models)
app = Flask(__name__,
            static_url_path='/',
            static_folder='build/')
CORS(app, support_credentials=True)
models=[]
def train_models_route():
    models.clear()
    data = load_data()
    X = data[['income', 'age']]
    y = data.drop(columns=['income', 'username', 'age'])
    models.append(train_models(X, y))
train_models_route()
print("MODES", models[0]['Clothes'])
def generate_pie_chart(username):
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="dheerizz",
        database='Finance Tracker'
    )
    mycursor = mydb.cursor()

    sql = "SELECT type, SUM(amount) FROM expenses WHERE username = %s GROUP BY type"
    mycursor.execute(sql, (username,))
    transactions = mycursor.fetchall()

    # Process the data
    types = [transaction[0] for transaction in transactions]
    amounts = [transaction[1] for transaction in transactions]

    # Create a pie chart
    plt.figure(figsize=(4, 4))
    plt.pie(amounts, labels=types, autopct='%1.1f%%', startangle=140)
    plt.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.
    plt.title(f"Total Amount Spent by {username}")

    # Save the chart as an image file
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    chart_data = base64.b64encode(buffer.getvalue()).decode('utf-8')

    # Clear the figure to release memory
    plt.clf()
    plt.close()

    return chart_data


# Function to update and save the trained model

# Your Flask routes
# ...

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
        user.execute(f"INSERT INTO income VALUE('{username}', 0, 0, 0)")
        mydb.commit()
        
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": "An error occurred while trying to add the new user."})

@app.route('/api/addincome', methods=['POST'])
def addincome():
    data = request.get_json()
    salary = data["salary"]
    business = data['business']
    sideHustle = data['sideHustle']
    username = data['username']
    print(sideHustle)
    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            password="dheerizz",
            database='Finance Tracker'
        )

        user = mydb.cursor()
        user.execute(f"SELECT * FROM income WHERE username='{username}'")
        if not user.fetchall():
            user.execute(f"INSERT INTO income(username, salary, business, sideHustle) VALUES('{username}', {salary}, {business}, {sideHustle})")
        else:
            print(f"UPDATE income set salary={salary}, business={business}, sideHustle={sideHustle} where username={username}")
            user.execute(f"UPDATE income set salary={salary}, business={business}, sideHustle={sideHustle} where username='{username}'")
        # user.execute(f"INSERT INTO income(username, salary, business, sideHustle) VALUES('{username}', {salary}, {business}, {sideHustle}) on duplicate key update salary={salary}, business={business}, sideHustle={sideHustle}")
        print(f"INSERT INTO income(username, salary, business, sideHustle) VALUES('{username}', {salary}, {business}, {sideHustle}) on duplicate key update salary=VALUES({salary}), business=VALUES({business}), sideHustle=VALUES({sideHustle})")
        mydb.commit()

        return jsonify({"success": True})
    except Exception as e:
        print(e)
        return jsonify({"success": False, "error": "An error occurred while trying to add the new user."})

@app.route('/api/addexpense', methods=['POST'])
def addExpense():
    # Parse request data
    data = request.get_json()
    amount = data['amount']
    expense_type = data['type']
    username = data['username'] 
    current_date = date.today() # Assuming username is provided in the request
    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            password="dheerizz",
            database='Finance Tracker'
        )

        user = mydb.cursor()
        user.execute(f"INSERT INTO expenses VALUE('{username}', '{expense_type}', '{current_date}', {amount})")
        mydb.commit()
        train_models_route()
        response = jsonify({"success": True})
        response.headers.add('Access-Control-Allow-Origin', '*')  
        return response    
    except Exception as e:
        return jsonify({"success": False, "error": "An error occurred while trying to add the new expense."})
    
@app.route('/api/addbudget', methods=['POST'])
def addBudget():
    # Parse request data
    data = request.get_json()
    amount = data['amount']
    expense_type = data['type']
    username = data['username'] 
    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            password="dheerizz",
            database='Finance Tracker'
        )

        user = mydb.cursor()
        user.execute(f"SELECT * FROM monthlyBudget WHERE username='{username}'  AND type='{expense_type}'")
        
        if (user.fetchone()) is None:
            user.execute(f"INSERT INTO monthlyBudget VALUE('{username}', {amount}, '{expense_type}')")
        else:
            user.execute(f"UPDATE monthlyBudget set budget = {amount} where username='{username}' AND type='{expense_type}'")
        mydb.commit()
        response = jsonify({"success": True})
        response.headers.add('Access-Control-Allow-Origin', '*')  
        return response    
    except Exception as e:
        print(e)
        return jsonify({"success": False, "error": "An error occurred while trying to add the new expense."})

@app.route('/api/returnexpense', methods=['POST'])
# @cross_origin()
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
        month=mydb.cursor()
        month.execute(f"SELECT expenses.type, SUM(expenses.amount) AS total_amount, users.age, income.salary, income.business, income.sideHustle FROM expenses RIGHT JOIN users ON expenses.username = users.username RIGHT JOIN income ON users.username = income.username WHERE expenses.username = '{username}' AND expenses.day >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) GROUP BY expenses.type, users.age, income.salary, income.business, income.sideHustle")
        month=month.fetchall()
        expense_types = [  "Food",  "Travel",  "Rent",  "Investment",  "Clothes",  "Fun",  "Health",  "Misc",]
        age=month[0][2]
        print(age)
        income=int(month[0][3])+int(month[0][4])+int(month[0][5])
        print(income)
        prediction={}
        for type in expense_types:
            # print(models[type])
            print("PREDICTING")
            prediction[type]=models[0][type].predict([[age,income]])[0]
            print(prediction[type])
        print(prediction)
        budget=mydb.cursor()
        budget.execute(f"SELECT * FROM monthlyBudget WHERE username='{username}'")
        t=budget.fetchall()
        budget={}
        for i in t:
            budget[i[2]]=i[1]
        print(budget)
        response = jsonify({"success": True, "expense":user, "month": month, "recommendation":prediction, "budget":budget})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Expose-Headers', 'Content-Type,Content-Length,Authorization,X-Pagination')
        print(response)
        return response    
    except Exception as e:
        print("eroor", e)
        return jsonify({"success": False, "error": e})

@app.route('/api/returnchart', methods=['POST'])
def returnchart():
    data = request.get_json()
    username = data['username']
    print(username)
    chart_data = generate_pie_chart(username    )
    response=jsonify({'chartData': chart_data})
    response.headers.add('Access-Control-Allow-Origin', '*')  
    return response


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

