import React, { useContext, useState } from "react";
import { Link, json, useNavigate } from "react-router-dom";
import userContext from "../Context/Context";

const Signup = () => {
  const context = useContext(userContext);
  const { user, showForm, setShowForm } = context;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const options = [
    "Food",
    "Travel",
    "Rent",
    "Investment",
    "Clothes",
    "Fun",
    "Health",
    "Misc",
  ];
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };
  
  let navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: 0,
  });
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    console.log(formData);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOption || formData.amount == 0) {
      alert("Please enter all values");
      return;
    }
    const form = {
      username: user[3],
      amount: formData.amount,
      type: selectedOption,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/addbudget",
        requestOptions
      );
      console.log(response);
      const responseData = await response.json();
      console.log(responseData); // assuming the response is JSON
      if (!responseData.success) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
  return (
    
    <div  className="min-h-screen fixed bg-black flex justify-center items-center bg-opacity-80  sm:px-6 h-full w-full ">
      <div id="form" className="w-max p-10 bg-white rounded-xl opacity-100  h-max">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Add Expenses
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please provide all the details
          </p>
        </div>

        <form className="mt-8 space-y-6 flex items-center " method="POST">
          <div className="mr-10">

          <div className="relative px-5 py-2">
            <label className="text-sm font-bold text-gray-700 tracking-wide">
              Amonut:{"\t\t\t"}    
            </label>
            <input
              className=" w-full text-base py-2 border-b border-gray-300 focus:outline-none focus:border-green-400"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              />
          </div>
          <div className="relative px-5 mt-3">
            <label className="text-sm font-bold text-gray-700 tracking-wide mb-3">
              Type
            </label>
            <button
        type="button"
        onClick={toggleDropdown}
        className="block w-full overflow-auto px-4 mt-4 py-2 text-left border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
      >
        {selectedOption || "Select an option"}
        <svg
          className={`absolute inset-y-0 right-0 w-5 h-5 mt-1 mr-2 text-gray-600 pointer-events-none ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M6.293 7.293a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L10 10.414l-2.293 2.293a1 1 0 01-1.414-1.414l3-3z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
          {options.map((option, index) => (
            <div
              key={index}
              className="px-4 py-2 cursor-pointer overflow-auto hover:bg-gray-100"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center bg-green-400 text-gray-100 p-4  rounded-full tracking-wide
                                  font-semibold  focus:outline-none focus:shadow-outline hover:bg-green-600 shadow-lg cursor-pointer transition ease-in duration-300"
              onClick={handleSubmit}
            >
              Add Expense
            </button>
            <button
              type="button"
              className="w-full mt-12 flex justify-center bg-green-400 text-gray-100 p-4  rounded-full tracking-wide
                                  font-semibold  focus:outline-none focus:shadow-outline hover:bg-green-600 shadow-lg cursor-pointer transition ease-in duration-300"
              onClick={()=>{setShowForm(false)}}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
