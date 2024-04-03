import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import mysql.connector
import joblib

def load_data():
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="dheerizz",
        database='Finance Tracker'
    )
    mycursor = mydb.cursor()
    mycursor.execute('SELECT DISTINCT USERNAME FROM expenses')
    usernames = mycursor.fetchall()
    
    results_dict = {}
    expenses_dict = {}

    for username in usernames:
        mycursor.execute(f"SELECT sum(amount), `type` from expenses where username='{username[0]}' group by `type`")
        results = mycursor.fetchall()
        results_dict[username[0]] = results
        
        mycursor.execute(f"SELECT SUM(income.salary) AS total_salary, SUM(income.business) AS total_business, SUM(income.sideHustle) AS total_side_hustle, users.username, users.age FROM income INNER JOIN users ON income.username = users.username WHERE users.username = '{username[0]}' GROUP BY users.username, users.age;")
        inc = mycursor.fetchall()
        if len(inc) != 0:
            expenses_dict[username[0]] = [(inc[0][0] + inc[0][1] + inc[0][2], inc[0][4])]
        else:
            expenses_dict[username[0]] = [0]

    dataframes_list = []
    for username, results in results_dict.items():
        df = pd.DataFrame(results, columns=['amount', 'type'])
        df['username'] = username
        dataframes_list.append(df)

    expenseList = []
    for username, results in expenses_dict.items():
        df = pd.DataFrame(results, columns=['income', 'age'])
        df['username'] = username
        expenseList.append(df)

    expenses = pd.concat(dataframes_list, ignore_index=True)
    income = pd.concat(expenseList, ignore_index=True)

    expenses_pivot = expenses.pivot(index='username', columns='type', values='amount').fillna(0)

    data = pd.merge(income, expenses_pivot, on='username', how='left').fillna(0)

    return data

def train_models(X_train, y_train):
    models = {}
    for expense_type in y_train.columns:
        model = RandomForestRegressor(n_estimators=5)
        model.fit(X_train, y_train[expense_type])
        models[expense_type] = model
        joblib.dump(model, f"{expense_type}.pkl")
    return models

def main():
    data = load_data()
    X = data[['income', 'age']]
    y = data.drop(columns=['income', 'username', 'age'])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, train_size=0.8, random_state=42)

    models = train_models(X_train, y_train)

    y_pred = pd.DataFrame({expense_type: model.predict(X_test) for expense_type, model in models.items()})
    mse = mean_squared_error(y_test, y_pred)
    print("Mean Squared Error:", mse)

if __name__ == "__main__":
    main()
