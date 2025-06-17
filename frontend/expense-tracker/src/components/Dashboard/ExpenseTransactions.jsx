import moment from "moment";
import React from "react";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

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

const ExpenseTransactions = ({ transactions, onSeeMore }) => (
  <div
    className="card transition-transform duration-300"
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
      <h5 className="text-lg text-gray-900">Expenses</h5>
      <button className="card-btn" onClick={onSeeMore}>
        See All <LuArrowRight className="text-base" />
      </button>
    </div>
    <div className="mt-6 rounded-xl p-3 bg-white">
      {transactions?.slice(0, 5)?.map((expense) => (
        <TransactionInfoCard
          key={expense._id}
          title={expense.category}
          icon={expense.icon}
          date={moment(expense.date).format("Do MMM YYYY")}
          amount={expense.amount}
          type="expense"
          hideDeleteBtn
        />
      ))}
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

export default ExpenseTransactions;


