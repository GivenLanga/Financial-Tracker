import React, { useState } from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const cardClipPath =
  "polygon(0 8%, 8% 0, 92% 0, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0 92%)";

const cardStyle = {
  clipPath: cardClipPath,
  background: "rgba(255,255,255,0.72)",
  boxShadow:
    "0 8px 32px 0 rgba(109,40,217,0.13), 0 2px 16px 0 rgba(30,0,60,0.10), 0 0 0 2.5px rgba(168,85,247,0.12)",
  border: "none",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  position: "relative",
  overflow: "hidden",
};

const borderStyle = {
  content: "''",
  position: "absolute",
  inset: 0,
  zIndex: 1,
  borderRadius: "22px",
  pointerEvents: "none",
  background:
    "conic-gradient(from 180deg at 50% 50%, #a855f7 0%, #facc15 50%, #a855f7 100%)",
  opacity: 0.18,
  filter: "blur(2.5px)",
  animation: "dashboard-card-border 6s linear infinite",
};

const FinanceOverview = ({
  totalBalance,
  totalIncome,
  totalExpense,
  budget: initialBudget = 10000,
}) => {
  const COLORS = ["#875CF5", "#FA2C37", "#FF6900"];

  const balanceData = [
    { name: "Total Balance", amount: totalBalance },
    { name: "Total Expenses", amount: totalExpense },
    { name: "Total Income", amount: totalIncome },
  ];

  const [budget, setBudget] = useState(initialBudget);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(budget);

  const used = totalExpense;
  const percent = Math.min(100, Math.round((used / budget) * 100));

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    const val = Number(inputValue);
    if (!isNaN(val) && val > 0) {
      setBudget(val);
      setEditing(false);
    }
  };

  return (
    <div
      className="card transition-transform duration-300 dashboard-card-hover"
      style={cardStyle}
    >
      <div style={borderStyle} />
      <div className="flex items-center justify-between ">
        <h5 className="text-lg">Financial Overview</h5>
      </div>

      <CustomPieChart
        data={balanceData}
        label="Total Balance"
        totalAmount={`R${totalBalance}`}
        colors={COLORS}
        showTextAnchor
      />
      <div className="mt-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-600">
            Budget Usage
          </span>
          <span className="text-xs font-semibold text-purple-700">
            {percent}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden relative">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percent}%`,
              background: "linear-gradient(90deg, #a855f7 0%, #facc15 100%)",
              boxShadow: "0 1px 6px 0 rgba(168,85,247,0.15)",
            }}
          />
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              width: `${percent}%`,
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.02) 60%)",
              mixBlendMode: "screen",
              pointerEvents: "none",
              animation: "shine-bar 2.5s linear infinite",
            }}
          />
        </div>
        <style>
          {`
            @keyframes shine-bar {
              0% { opacity: 0.7; transform: translateX(-100%) skewX(-12deg);}
              60% { opacity: 1; }
              100% { opacity: 0.7; transform: translateX(120%) skewX(-12deg);}
            }
          `}
        </style>
        <div className="flex justify-between text-[11px] text-gray-400 mt-1 items-center gap-2">
          <span>Used: R{used}</span>
          <span>
            Budget:{" "}
            {editing ? (
              <form onSubmit={handleBudgetSubmit} className="inline">
                <input
                  type="number"
                  min={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-20 px-1 py-0.5 rounded border border-gray-300 text-xs"
                  autoFocus
                  onBlur={() => setEditing(false)}
                />
              </form>
            ) : (
              <span
                className="cursor-pointer underline text-purple-700"
                title="Click to edit"
                onClick={() => {
                  setEditing(true);
                  setInputValue(budget);
                }}
              >
                R{budget}
              </span>
            )}
          </span>
        </div>
      </div>
      <style>
        {`
          @keyframes dashboard-card-border {
            0% { filter: blur(2.5px) hue-rotate(0deg);}
            100% { filter: blur(2.5px) hue-rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
};

export default FinanceOverview;
