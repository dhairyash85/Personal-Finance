import React, { useState } from "react";
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
const Signup = () => {
    let navigate=useNavigate()
    const [formData, setFormData]=useState({
      email:"",
      password:"",
      username:"",
      fname:"",
      lname:"",
      age:0,
    })
    const handleChange=(event)=>{
      setFormData({...formData,[event.target.name]: event.target.value})
      console.log(formData)
  }
  const handleSubmit=async (e)=>{
    e.preventDefault()
    const response=await axios.post(" http://127.0.0.1:5000/api/signup", {
      email:formData.email,
      password:formData.password,
      username:formData.username,
      fname:formData.fname,
      lname:formData.lname,
      age:formData.age,
    }, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    console.alert(response)
  }
    return (    
      <div
        className="min-h-screen flex justify-center py-12  sm:px-6 lg:px-8 items-center  bg-gray-500"
      >
     
        <div className="w-max space-y-8 p-10 bg-white rounded-xl z-10">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Welcom Back!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to your account
            </p>
          </div>
          
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" value="true" />
            <div className="relative">
              
              <label className="text-sm font-bold text-gray-700 tracking-wide">
                Email
              </label>
              <input
                className=" w-full text-base py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                type="text"
                name="email"
                placeholder="mail@gmail.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mt-8 content-center">
              <label className="text-sm font-bold text-gray-700 tracking-wide">
                Password
              </label>
              <input
                className="w-full content-center text-base py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="mt-8 content-center">
              <label className="text-sm font-bold text-gray-700 tracking-wide">
                username
              </label>
              <input
                className="w-full content-center text-base py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                type="text"
                name="username"
                placeholder="Enter your Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="mt-8 content-center">
              <label className="text-sm font-bold text-gray-700 tracking-wide">
                fname
              </label>
              <input
                className="px-3 content-center text-base py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                type="text"
                name="fname"
                placeholder="Enter your First Name"
                value={formData.fname}
                onChange={handleChange}
              />
              <label className="text-sm font-bold text-gray-700 tracking-wide">
                Last Name 
              </label>
              <input
                className="px-3 content-center text-base py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                type="text"
                name="lname"
                placeholder="Enter your Last Name"
                value={formData.lname}
                onChange={handleChange}
              />
            </div>
            <div className="mt-8 content-center">
              <label className="text-sm font-bold text-gray-700 tracking-wide">
                age
              </label>
              <input
                className="w-full content-center text-base py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                type="number"
                name="age"
                placeholder="Enter your Age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center bg-indigo-500 text-gray-100 p-4  rounded-full tracking-wide
                                  font-semibold  focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg cursor-pointer transition ease-in duration-300"
                onClick={handleSubmit}
                
              >
                Sign up
              </button>
            </div>
            <p className="flex flex-col items-center justify-center mt-10 text-center text-md text-gray-500">
              <span>Registered?</span>
              
              <Link to='/login'>Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    );
}

export default Signup