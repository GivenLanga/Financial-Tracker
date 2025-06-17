import React, { useEffect, useState } from "react";
import CustomBarChart from "../Charts/CustomBarChart";
import { prepareExpenseBarChartData } from "../../utils/helper";

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

const Last30DaysExpenses = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareExpenseBarChartData(data);
    setChartData(result);

    return () => {};
  }, [data]);

  return (
    <div
      className="card col-span-1 transition-transform duration-300"
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 16px 48px 0 rgba(109,40,217,0.18), 0 4px 24px 0 rgba(30,0,60,0.13), 0 0 0 3.5px rgba(168,85,247,0.18)";
        e.currentTarget.style.transform = "scale(1.022)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "0 8px 32px 0 rgba(109,40,217,0.13), 0 2px 16px 0 rgba(30,0,60,0.10), 0 0 0 2.5px rgba(168,85,247,0.12)";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <div style={borderStyle} />
      <div className="flex items-center justify-between rounded-xl p-3 mb-2 bg-white">
        <h5 className="text-lg text-gray-900">Last 30 Days Expenses</h5>
      </div>
      <div className="rounded-xl p-3 bg-white">
        <CustomBarChart data={chartData} />
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

export default Last30DaysExpenses;
