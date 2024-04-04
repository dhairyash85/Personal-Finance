import React, { useContext, useEffect, useState } from "react";
import userContext from "../Context/Context";

const Stats = () => {
  const context = useContext(userContext);
  const [expenses, setExpenses] = useState([[]]);
  const [chartData, setChartData] = useState("");
  const [recommendation, setRecommendation]=useState()
  const [monthExpense, setMonthExpense]=useState([[]])
  const [monthBudget, setMonthBudget]=useState([[]])

  const { user } = context;
  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({"username":user[3]})
      
    };
    // console.log(requestOptions)
    fetch(`http://localhost:5000/api/returnchart`, requestOptions)
      .then((response) => response.json())
      .then((data) => setChartData(data.chartData));
  }, []);
  
  useEffect(() => {
    if (user) {
const onLogin = async () => {
    let form;
    if (user) {
      form = {
        username: user[3],
      };
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    };

    try {
      fetch(
        "http://127.0.0.1:5000/api/returnexpense",
        requestOptions
      ).then((response) => response.json())
      .then((responseData) => {
        setExpenses(responseData.expense);
        setMonthExpense(responseData.month);
        setRecommendation(responseData.recommendation)
        setMonthBudget(responseData.budget)
        console.log(responseData.budget)
      }).catch(err=>{console.log("err", err)});
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
      onLogin();
    }
  }, [user]);
  const returnDate = (datetime) => {
    if (datetime) {
      const dateParts = datetime.split(" ");
      return dateParts[2] + " " + dateParts[1] + " " + dateParts[3];
    }
  };
  const totalSpent = () => {
    console.log("starting");
    let sum = 0;
    expenses.forEach((expense) => (sum += +expense[3]));
    console.log(sum);
    return sum;
  };
  return (
    
    <div className="min-h-screen">
      {recommendation && (
        <div className="flex justify-around flex-wrap gap-3">
        <div>
          <img className="rounded-xl" src={`data:image/png;base64,${chartData}`} alt="Pie Chart" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-xl text-2xl sm:text-lg md:text-lg">
            <thead>
              <tr className="bg-blue-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Budget</th>
                <th className="py-3 px-4 text-left">Recommendation</th>
              </tr>
            </thead>
            <tbody className="text-blue-gray-900">
              {monthExpense.map((expense) => {
                return (
                  <tr className="border-b border-blue-gray-200">
                    <td className="py-3 px-4">{expense[0]}</td>
                    <td className="py-3 px-4">{expense[1]}</td>
                    <td className="py-3 px-4">{monthBudget[expense[0]]?monthBudget[expense[0]]:"  "}</td>
                    <td className="py-3 px-4">{expense[0]=='Travel' || expense[0]=='Health'? "-":recommendation[expense[0]]}</td>
                  </tr>
                );
              })}
              <tr className="border-b border-blue-gray-200">
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4">{totalSpent()}</td>
                    
                  </tr>
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-xl text-2xl sm:text-lg md:text-lg">
            <thead>
              <tr className="bg-blue-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left">Username</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Amount</th>
              </tr>
            </thead>
            <tbody className="text-blue-gray-900">
              {expenses.map((expense) => {
                return (
                  <tr className="border-b border-blue-gray-200">
                    <td className="py-3 px-4">{expense[0]}</td>
                    <td className="py-3 px-4">{expense[1]}</td>
                    <td className="py-3 px-4">{returnDate(expense[2])}</td>
                    <td className="py-3 px-4">{expense[3]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
       
      </div>
      )}
      
    </div>
  );
};

export default Stats;
