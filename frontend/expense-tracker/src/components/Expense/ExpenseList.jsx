import React from "react";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";
import { LuDownload } from "react-icons/lu";

// Dashboard theme card style (no clip-path)
const cardStyle = {
  background: "rgba(255,255,255,0.72)",
  boxShadow:
    "0 8px 32px 0 rgba(109,40,217,0.13), 0 2px 16px 0 rgba(30,0,60,0.10), 0 0 0 2.5px rgba(168,85,247,0.12)",
  border: "none",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

const ExpenseList = ({ transactions, onDelete, onDownload, onEdit }) => {
  return (
    <div className="card" style={cardStyle}>
      <div className="flex items-center justify-between">
        <h5 className="text-lg">All Expanses</h5>

        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {transactions?.map((expense) => (
          <TransactionInfoCard
            key={expense._id}
            title={expense.category}
            icon={expense.icon}
            date={moment(expense.date).format("Do MMM YYYY")}
            amount={expense.amount}
            type="expense"
            onDelete={() => onDelete(expense._id)}
            onEdit={() => onEdit && onEdit(expense)}
            showEditBtn
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
