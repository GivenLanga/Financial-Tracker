import React from "react";
import {
  LuUtensils,
  LuTrendingUp,
  LuTrendingDown,
  LuTrash2,
} from "react-icons/lu";
import { FaRegEdit } from "react-icons/fa";

const TransactionInfoCard = React.memo(
  ({
    icon,
    title,
    date,
    amount,
    type,
    hideDeleteBtn,
    onDelete,
    onEdit,
    showEditBtn,
  }) => {
    const getAmountStyles = () =>
      type === "income"
        ? "bg-green-50 text-green-500"
        : "bg-red-50 text-red-500";

    return (
      <div
        className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg transition-transform duration-300"
        style={{
          background: "rgba(255,255,255,0.92)",
          boxShadow:
            "0 4px 24px 0 rgba(109,40,217,0.10), 0 1.5px 8px 0 rgba(255,255,255,0.06) inset, 0 1px 8px 0 rgba(30,0,60,0.08)",
          transform:
            "perspective(800px) rotateY(-4deg) rotateX(2deg) scale3d(1.01,1.01,1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform =
            "perspective(800px) rotateY(-1deg) rotateX(0.5deg) scale3d(1.025,1.025,1)";
          e.currentTarget.style.boxShadow =
            "0 12px 36px 0 rgba(109,40,217,0.16), 0 1.5px 8px 0 rgba(255,255,255,0.09) inset, 0 2px 12px 0 rgba(30,0,60,0.10)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform =
            "perspective(800px) rotateY(-4deg) rotateX(2deg) scale3d(1.01,1.01,1)";
          e.currentTarget.style.boxShadow =
            "0 4px 24px 0 rgba(109,40,217,0.10), 0 1.5px 8px 0 rgba(255,255,255,0.06) inset, 0 1px 8px 0 rgba(30,0,60,0.08)";
        }}
      >
        <div
          className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full shadow"
          style={{
            boxShadow:
              "0 2px 8px 0 rgba(168,85,247,0.10), 0 1.5px 8px 0 rgba(255,255,255,0.08) inset",
          }}
        >
          {icon ? (
            // If icon is a valid image URL, render as image, else render as emoji or fallback
            icon.startsWith("http") || icon.startsWith("data:") ? (
              <img src={icon} alt={title} className="w-6 h-6" />
            ) : (
              <span style={{ fontSize: "1.5rem" }}>{icon}</span>
            )
          ) : (
            <LuUtensils />
          )}
        </div>

        <div className="flex-1 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700 font-medium">{title}</p>
            <p className="text-xs text-gray-400 mt-1">{date}</p>
          </div>

          <div className="flex items-center gap-2">
            {showEditBtn && (
              <button
                className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={onEdit}
              >
                <FaRegEdit size={18} />
              </button>
            )}

            {!hideDeleteBtn && (
              <button
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={onDelete}
              >
                <LuTrash2 size={18} />
              </button>
            )}

            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}
            >
              <h6 className="text-xs font-medium">
                {type === "income" ? "+" : "-"} R{amount}
              </h6>
              {type === "income" ? <LuTrendingUp /> : <LuTrendingDown />}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default TransactionInfoCard;
