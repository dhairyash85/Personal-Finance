import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userContext from "../Context/Context";
const Login = () => {
  const context = useContext(userContext);
  const { user, setUser } = context;
  let navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = {
      email: formData.email,
      password: formData.password,
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
        "http://127.0.0.1:5000/api/login",
        requestOptions
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error("Network response was not ok");
      } else {
        setUser(data.user);
        navigate("/");
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
  return (
    <div className="min-h-screen flex justify-center   sm:px-6 lg:px-8  ">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl z-10 h-max">
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
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-500 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center bg-indigo-500 text-gray-100 p-4  rounded-full tracking-wide
                                font-semibold  focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg cursor-pointer transition ease-in duration-300"
              onClick={handleSubmit}
            >
              Sign in
            </button>
          </div>
          <p className="flex flex-col items-center justify-center mt-10 text-center text-md text-gray-500">
            <span>Don't have an account?</span>
            <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
