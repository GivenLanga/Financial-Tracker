import React, { useEffect, useState } from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"];
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

const RecentIncomeWithChart = ({ data, totalIncome }) => {
  const [chartData, setChartData] = useState([]);

  const prepareChartData = () => {
    const dataArr = data?.map((item) => ({
      name: item?.source,
      amount: item?.amount,
    }));

    setChartData(dataArr);
  };

  useEffect(() => {
    prepareChartData();

    return () => {};
  }, [data]);

  return (
    <div
      className="card transition-transform duration-300 dashboard-card-hover"
      style={cardStyle}
    >
      <div style={borderStyle} />
      <div className="flex items-center justify-between ">
        <h5 className="text-lg">Last 60 Days Income</h5>
      </div>

      <CustomPieChart
        data={chartData}
        label="Total Income"
        totalAmount={`R${totalIncome}`}
        showTextAnchor
        colors={COLORS}
      />
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

export default RecentIncomeWithChart;
