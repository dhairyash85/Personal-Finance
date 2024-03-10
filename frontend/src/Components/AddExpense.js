import React, { useContext, useState } from "react";
import { Link, json, useNavigate } from "react-router-dom";
import userContext from "../Context/Context";

const Signup = () => {
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
  const context = useContext(userContext);
  const { user } = context;
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
      username: user[0],
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
        "http://127.0.0.1:5000/api/addexpense",
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
    <div className="min-h-screen flex justify-center  sm:px-6 lg:px-8  ">
      <div className="w-max  p-10 bg-white rounded-xl z-10 h-max">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Add Expenses
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please provide all the details
          </p>
        </div>

        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="relative">
            <label className="text-sm font-bold text-gray-700 tracking-wide">
              Amonut
            </label>
            <input
              className=" w-full text-base py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
              type="number"
              name="amount"
              placeholder="mail@gmail.com"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <label className="text-sm font-bold text-gray-700 tracking-wide">
              Type
            </label>
            <button
              type="button"
              onClick={toggleDropdown}
              className="block w-full px-4 py-2 text-left border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
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
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center bg-indigo-500 text-gray-100 p-4  rounded-full tracking-wide
                                  font-semibold  focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg cursor-pointer transition ease-in duration-300"
              onClick={handleSubmit}
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
