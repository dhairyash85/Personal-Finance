import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import userContext from "../Context/Context";
import AddExpense from "./AddExpense"
import Hero from "./Hero";

const Home = () => {
  const context = useContext(userContext);
  const { user, showForm, setShowForm } = context;
  const [expenses, setExpenses] = useState([[]]);
  
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
  const totalExpense=(expenses)=>{
    let t=0
    expenses.map(expense=>t+=expense)
    return
  }
  return (
    <div>
      <Hero/>
      {showForm && (
        <div className="h-screen fixed top-0 bg-black" >
          <AddExpense />
        </div>
      )}
    </div>
  );
};

export default Home;
