import React, { useContext } from "react";
import { Link } from "react-router-dom";
import userContext from "../Context/Context";

const Navbar = () => {
  const { user, setUser } = useContext(userContext);
  const logout = () => {
    setUser([]);
  };
  return (
    <>
      <nav className="mb-10 py-5 px-12">
        <div className="w-full mx-auto">
          <div className="mx-2 flex flex-wrap items-center justify-between">
            <a href="#" className="flex">
              <span className="text-gradient text-5xl font-bold">
                Personal Finance
              </span>
            </a>
            <div className="flex md:hidden md:order-2">
              <button
                data-collapse-toggle="mobile-menu-3"
                type="button"
                className="md:hidden text-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg inline-flex items-center justify-center"
                aria-controls="mobile-menu-3"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <svg
                  className="hidden w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <div
              className="hidden md:flex justify-between items-end w-full md:w-auto md:order-1"
              id="mobile-menu-3"
            >
              <ul className="flex-col md:flex-row flex md:space-x-8 mt-4 md:mt-0 md:text-sm md:font-medium">
                <Link to="/">
                  <li>
                    <div
                      className="text-white text-xl hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:hover:text-blue-700 md:p-0"
                      aria-current="page"
                    >
                      Home
                    </div>
                  </li>
                </Link>
                <li>
                  {user.length == 0 ? (
                    <Link to="/login">
                      <div className="text-white text-xl hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:hover:text-blue-700 md:p-0">
                        Login
                      </div>
                    </Link>
                  ) : (
                    <Link to="/login" onClick={logout}>
                      <div className="text-white text-xl hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:hover:text-blue-700 md:p-0">
                        Logout
                      </div>
                    </Link>
                  )}
                </li>
                {user.length != 0 ? (
                  <li>
                    <Link to="/addexpense">
                      <div className="text-white text-xl hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:hover:text-blue-700 md:p-0">
                        Add Expenses
                      </div>
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link to="/signup">
                      <div className="text-white text-xl hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 block pl-3 pr-4 py-2 md:hover:text-blue-700 md:p-0">
                        Sign Up
                      </div>
                    </Link>
                  </li>
                )}
                {user.length != 0 && (
                  <div className="text-white text-3xl hover:text-gray-400 border-b border-gray-100 md:border-0 block pl-3 pr-4 py-2 md:p-0">
                    User: {user[0]}
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <script src="https://unpkg.com/@themesberg/flowbite@1.1.1/dist/flowbite.bundle.js"></script>
    </>
  );
};

export default Navbar;
