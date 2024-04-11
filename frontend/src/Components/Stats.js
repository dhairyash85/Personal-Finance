import React, { useContext, useEffect, useState } from "react";
import userContext from "../Context/Context";
import { Pie } from 'react-chartjs-2';
const Stats = () => {
  const context = useContext(userContext);
  const [expenses, setExpenses] = useState([[]]);
  const [chartData, setChartData] = useState("");
  const [recommendation, setRecommendation] = useState();
  const [monthExpense, setMonthExpense] = useState([[]]);
  const [monthBudget, setMonthBudget] = useState([[]]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("1 Month");
  const [type, setType] = useState("All");
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(!isOpen);
  };
  const options = ["1 Month", "3 Month", "1 Year"];
  const types = [
    "All",
    "Food",
    "Travel",
    "Rent",
    "Investment",
    "Clothes",
    "Fun",
    "Health",
    "Misc",
  ];
  const { user } = context;
  useEffect(() => {
    const interval =
      selectedOption == "1 Month" ? 1 : selectedOption == "3 Month" ? 3 : 12;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user[3],
        interval: interval,
      }),
    };
    // console.log(requestOptions)
    fetch(`http://localhost:5000/api/returnchart`, requestOptions)
      .then((response) => response.json())
      .then((data) => setChartData(data.chartData));
  }, [selectedOption]);

  useEffect(() => {
    if (user) {
      const onLogin = async () => {
        let form;
        const interval =
          selectedOption == "1 Month"
            ? 1
            : selectedOption == "3 Month"
            ? 3
            : 12;
        if (user) {
          form = {
            username: user[3],
            interval: interval,
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
          fetch("http://127.0.0.1:5000/api/returnexpense", requestOptions)
            .then((response) => response.json())
            .then((responseData) => {
              setExpenses(responseData.expense);
              setMonthExpense(responseData.month);
              setRecommendation(responseData.recommendation);
              setMonthBudget(responseData.budget);
              // console.log(responseData.budget);
              const data = {
                labels: responseData.month[0],
                datasets: [
                  {
                    data: responseData.month[1],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                  },
                ],
              };
              
            })
            .catch((err) => {
              console.log("err", err);
            });
        } catch (error) {
          console.error("There was a problem with the fetch operation:", error);
        }
      };
      onLogin();
    }
  }, [user, selectedOption]);
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
      <form className=" flex justify-end px-7 mb-2">
        <div className="relative px-5 mt-3 ml-36 ">
          <button
            type="button"
            onClick={toggleDropdown}
            className="block w-48 overflow-auto px-4 mt-4 py-2 text-center text-black bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
          >
            {selectedOption || "1 Month"}
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
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer overflow-auto hover:bg-gray-100"
                  onClick={() => {
                    setSelectedOption(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative px-5 mt-3">
          <button
            type="button"
            onClick={() => setIsTypeOpen(!isTypeOpen)}
            className="block  w-48 overflow-auto px-4 mt-4 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 text-center"
          >
            {type || "Select a Type"}
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
          {isTypeOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
              {types.map((option, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer overflow-auto hover:bg-gray-100"
                  onClick={() => {
                    setType(option);
                    setIsTypeOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
      {recommendation && (
        <div className="flex justify-around flex-wrap gap-3">
          <div>
            <img
              className="rounded-xl"
              src={`data:image/png;base64,${chartData}`}
              alt="Pie Chart"
            />
          </div>
          <div className="overflow-x-auto  max-h-[400px] rounded-xl scrollbar">
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
                {monthExpense.map((expense, key) => {
                  return (
                    <tr className="border-b border-blue-gray-200">
                      <td className="py-3 px-4">{expense[0]}</td>
                      <td className="py-3 px-4">{expense[1]}</td>
                      <td className="py-3 px-4">
                        {monthBudget[expense[0]]
                          ? monthBudget[expense[0]]
                          : "-"}
                      </td>
                      <td className="py-3 px-4">
                        {expense[0] == "Travel" || expense[0] == "Health"
                          ? "-"
                          : recommendation[expense[0]]}
                      </td>
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
            <div className="overflow-x-auto max-h-[400px] rounded-xl scrollbar">
              <table className="min-w-full bg-white shadow-md rounded-xl text-2xl sm:text-lg md:text-lg overflow-auto columns-5">
                <thead>
                  <tr className="bg-blue-gray-100 text-gray-700">
                    <th className="py-3 px-4 text-left">Username</th>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-blue-gray-900">
                  {expenses.slice(0, 7).map((expense, index) => (
                    <>{
                      type=="All"?(<tr key={index} className="border-b border-blue-gray-200">
                      <td className="py-3 px-4">{expense[0]}</td>
                      <td className="py-3 px-4">{expense[1]}</td>
                      <td className="py-3 px-4">{returnDate(expense[2])}</td>
                      <td className="py-3 px-4">{expense[3]}</td>
                    </tr>):(<>
                      {expense[1]==type && (<tr key={index} className="border-b border-blue-gray-200">
                      <td className="py-3 px-4">{expense[0]}</td>
                      <td className="py-3 px-4">{expense[1]}</td>
                      <td className="py-3 px-4">{returnDate(expense[2])}</td>
                      <td className="py-3 px-4">{expense[3]}</td>
                    </tr>)}
                    </>)
                    }</>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
