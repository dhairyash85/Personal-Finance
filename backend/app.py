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
app = Flask(__name__,
            static_url_path='/',
            static_folder='build/')
CORS(app, support_credentials=True)
models={}
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

def load_models():
    models = {}
    expense_types = [  "Food",  "Travel",  "Rent",  "Investment",  "Clothes",  "Fun",  "Health",  "Misc",]  # Replace with your expense types
    for expense_type in expense_types:
        try:
            model = load(f"{expense_type}.pkl")
        except FileNotFoundError:
            model = RandomForestRegressor(n_estimators=5)  # Initialize a new model if file not found
        models[expense_type] = model
    return models

models = load_models()

# Function to update and save the trained model
def update_model(X_train, y_train, expense_type):
    model = RandomForestRegressor(n_estimators=5)
    model.fit(X_train, y_train)
    dump(model, f"{expense_type}.pkl")

# Function to retrieve training data from database
def get_training_data(expense_type):
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="dheerizz",
        database='Finance Tracker'
    )
    mycursor = mydb.cursor()
    mycursor.execute(f"SELECT SUM(amount) AS amount, type, username FROM expenses WHERE type = '{expense_type}' GROUP BY username")
    results = mycursor.fetchall()
    X_train = pd.DataFrame(columns=['income', 'age'])
    y_train = pd.DataFrame(columns=['amount'])
    for result in results:
        username = result[2]
        mycursor.execute(f"SELECT SUM(salary) AS total_salary, SUM(business) AS total_business, SUM(sideHustle) AS total_side_hustle, age FROM income INNER JOIN users ON income.username = users.username WHERE users.username = '{username}'")
        income_result = mycursor.fetchone()
        income = income_result[0] + income_result[1] + income_result[2]
        age = income_result[3]
        X_train = X_train.append({'income': income, 'age': age}, ignore_index=True)
        y_train = y_train.append({'amount': result[0]}, ignore_index=True)
    return X_train, y_train

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

        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": "An error occurred while trying to add the new user."})



def addExpense():
    # Parse request data
    data = request.get_json()
    amount = data['amount']
    expense_type = data['type']
    username = data['username']  # Assuming username is provided in the request

    # Retrieve training data for the expense type
    X_train, y_train = get_training_data(expense_type)

    # Update the existing row corresponding to the user
    user_index = X_train.index[X_train['username'] == username].tolist()[0]  # Find the index of the user
    y_train.loc[user_index] += amount  # Update the total expense amount for the user

    try:
        # Update and train model for the corresponding expense type
        update_model(X_train, y_train, expense_type)

        # Return response
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
        month=mydb.cursor()
        month.execute(f"SELECT type, SUM(amount) FROM expenses WHERE username = '{username}' AND day >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) GROUP BY type;")
        month=month.fetchall()
        print(month)
        response = jsonify({"success": True, "expense":user, "month": month})
        response.headers.add('Access-Control-Allow-Origin', '*')  
        return response    
    except Exception as e:
        return jsonify({"success": False, "error": "An error occurred while trying to retrieve the expenses."})

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
    app.run(debug=True, host='0.0.0.0')

