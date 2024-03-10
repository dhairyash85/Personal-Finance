import React, { useContext, useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Link, useNavigate } from 'react-router-dom'
import userContext from '../Context/Context'

const Home = () => {
  const context=useContext(userContext)
  const [expenses, setExpenses]=useState([[]])
  const {user}=context
  console.log(expenses)
  // username=user[3]
  const onLogin=async()=>{
    let form
    if(user){
      form={
        username:user[3]
      }
    }
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(form)
    };
  
    try {
      const response = await fetch('http://127.0.0.1:5000/api/returnexpense', requestOptions);
      // console.log(response)
      const responseData = await response.json();
      // console.log(responseData); // assuming the response is JSON
      if (!responseData.success) {
        throw new Error('Network response was not ok');
      }
      else{
        // console.log("User created")
        setExpenses(responseData.expense)
        console.log(responseData.expense)
        // const dateParts = expenses[0][2].split(" ");
        
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }
  useEffect( ()=>{
    if(user){
      onLogin()
    }
  },[user])
  console.log("Expense", expenses)
  // let navigate=useNavigate()
  const returnDate=(datetime)=>{
    if(datetime){

      const dateParts = datetime.split(" ");
      // return(datetime)
      return dateParts[2] + " " + dateParts[1] + " " + dateParts[3];
    }
  }
  return (
    <div>
      {user && (

       
      <>
      <div className='px-10'>
        <h1 className='text-4xl text-bold'>Username: {user[0]}</h1>
        
        <Link to='/addexpense'>
        <button className='mt-4 bg-blue-400 rounded border-black border-b'><p className='text-xl px-4'>Add Expense</p></button>
        </Link>
      </div>
      <div className="flex min-h-screen py-10 justify-center">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-xl">
            <thead>
              <tr className="bg-blue-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left">Username</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Amount</th>
              </tr>
            </thead>
            <tbody className="text-blue-gray-900">
              {
                expenses.map(expense=>{
                  return(
                    <tr className="border-b border-blue-gray-200">
                <td className="py-3 px-4">{expense[0]}</td>
                <td className="py-3 px-4">{expense[1]}</td>
                <td className="py-3 px-4">{returnDate(expense[2])}</td>
                <td className="py-3 px-4">{expense[3]}</td>
              </tr>
                  )
                })
              }
            </tbody>
          </table>
            
        </div>
      </div>
        </>
        )}
        
    </div>
  )
}

export default Home