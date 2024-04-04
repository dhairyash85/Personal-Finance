import React, { useContext, useState } from "react";
import userContext from "../Context/Context";
import AddBudget from "./AddBudget";

const Income = () => {
  const context = useContext(userContext);
  const { user, setShowForm, showForm } = context;
  const [formData, setFormData] = useState({
    business: 0,
    salary: 0,
    sideHustle: 0,
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleClick = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = {
      username: user[3],
      business: formData.business,
      salary: formData.salary,
      sideHustle: formData.sideHustle,
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
        "http://127.0.0.1:5000/api/addincome",
        requestOptions
      );
      const responseData = await response.json();
      if (!responseData.success) {
        throw new Error("Network response was not ok");
      } else {
        // Handle success
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <div className="min-h-screen relative">
      {showForm && <div className="absolute -top-32 bg-black z-30"><AddBudget/></div>}
      <div className="flex justify-center sm:px-6 lg:px-8 items-center">
        <div className="w-max space-y-8 p-10 bg-white rounded-xl z-10">
          <form className="mt-8 space-y-6" action="#" method="POST">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Add your income
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please sign in to your account
              </p>
            </div>
            <input type="hidden" name="remember" value="true" />
            <div className="relative">
              <label className="text-sm font-bold text-gray-700 tracking-wide">
                Salary
              </label>
              <input
                className="w-full text-base py-2 border-b border-gray-300 focus:outline-none focus:border-green-500"
                type="number"
                name="salary"
                placeholder="Salary"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>
            <div className="mt-8 content-center">
              <label className="text-sm font-bold text-gray-700 tracking-wide">
                Business
              </label>
              <input
                className="w-full content-center text-base py-2 border-b border-gray-300 focus:outline-none focus:border-green-500"
                type="number"
                name="business"
                placeholder="Business"
                value={formData.business}
                onChange={handleChange}
              />
            </div>
            <div className="mt-8 content-center">
              <label className="text-sm font-bold text-gray-700 tracking-wide">
                Side Income
              </label>
              <input
                className="w-full content-center text-base py-2 border-b border-gray-300 focus:outline-none focus:border-green-500"
                type="number"
                name="sideHustle"
                placeholder="Side Hustle"
                value={formData.sideHustle}
                onChange={handleChange}
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center bg-green-400 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-green-600 shadow-lg cursor-pointer transition ease-in duration-300"
                onClick={handleSubmit}
              >
                Add Income
              </button>
            </div>
          </form>
        </div>
      </div>
      <button
        className="flex text-white justify-center items-center w-max min-w-max sm:w-max px-6 h-12 rounded-full outline-none relative overflow-hidden border duration-300 ease-linear
        after:absolute after:inset-x-0 after:aspect-square after:scale-0 after:opacity-70 after:origin-center after:duration-300 after:ease-linear after:rounded-full after:top-0 after:left-0 after:bg-[#21492e] hover:after:opacity-100 hover:after:scale-[2.5] bg-green-400 border-transparent hover:border-[#21492e]"
        onClick={handleClick}
      >
        <span className="hidden sm:flex relative ">Add Expenses</span>
        <span className="flex sm:hidden relative ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default Income;
