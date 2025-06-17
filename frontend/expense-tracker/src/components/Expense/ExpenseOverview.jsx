import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import CustomLineChart from "../Charts/CustomLineChart";
import { prepareExpenseLineChartData } from "../../utils/helper";

// Dashboard theme card style (no clip-path)
const cardStyle = {
  background: "rgba(255,255,255,0.72)",
  boxShadow:
    "0 8px 32px 0 rgba(109,40,217,0.13), 0 2px 16px 0 rgba(30,0,60,0.10), 0 0 0 2.5px rgba(168,85,247,0.12)",
  border: "none",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

const ExpenseOverview = ({ transactions, onExpenseIncome }) => {
  const data = [
    { month: "Jan", amount: 1200 },
    { month: "Feb", amount: 1500 },
    { month: "Mar", amount: 1800 },
    { month: "Apr", amount: 1100 },
    { month: "May", amount: 2000 },
    { month: "Jun", amount: 1700 },
    { month: "Jul", amount: 1900 },
    { month: "Aug", amount: 2100 },
    { month: "Sep", amount: 1600 },
    { month: "Oct", amount: 2300 },
    { month: "Nov", amount: 2500 },
    { month: "Dec", amount: 2700 },
  ];

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareExpenseLineChartData(transactions);
    setChartData(result);

    return () => {};
  }, [transactions]);

  return (
    <div className="card" style={cardStyle}>
      <div className="flex items-center justify-between">
        <div className="">
          <h5 className="text-lg">Expense Overview</h5>
          <p className="text-xs text-gray-400 mt-0.5">
            Track your spending trends over time and gain insights into where
            your money goes.
          </p>
        </div>

        <button className="add-btn" onClick={onExpenseIncome}>
          <LuPlus className="text-lg" />
          Add Expense
        </button>
      </div>

      <div className="mt-10">
        <CustomLineChart data={chartData} />
      </div>
    </div>
  );
};

export default ExpenseOverview;
