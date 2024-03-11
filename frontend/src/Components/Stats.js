import React, { useContext, useEffect, useState } from "react";
import userContext from "../Context/Context";

const Stats = () => {
  const context = useContext(userContext);
  const [expenses, setExpenses] = useState([[]]);
  const { user } = context;
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
      const response = await fetch(
        "http://127.0.0.1:5000/api/returnexpense",
        requestOptions
      );
      const responseData = await response.json();
      if (!responseData.success) {
        throw new Error("Network response was not ok");
      } else {
        setExpenses(responseData.expense);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
  useEffect(() => {
    if (user) {
      onLogin();
    }
  }, [user]);
  const returnDate = (datetime) => {
    if (datetime) {
      const dateParts = datetime.split(" ");
      return dateParts[2] + " " + dateParts[1] + " " + dateParts[3];
    }
  };
  const totalSpent=()=>{

    let sum=0
    expenses[3].forEach((expense)=>sum+=expense)
    return sum
  }
  return (
    <div className="min-h-screen">
      <h1 className="text-4xl text-white font-bold">
        Total spending till now: {()=>totalSpent}
      </h1>
      <div className="flex justify-center">
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
    </div>
  );
};

export default Stats;
