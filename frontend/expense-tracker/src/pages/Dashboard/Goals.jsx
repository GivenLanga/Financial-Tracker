import React from "react";
import GoalsOverview from "../../components/Dashboard/GoalsOverview";

// Dashboard card style
const cardStyle = {
  background: "rgba(255,255,255,0.72)",
  boxShadow:
    "0 8px 32px 0 rgba(109,40,217,0.13), 0 2px 16px 0 rgba(30,0,60,0.10), 0 0 0 2.5px rgba(168,85,247,0.12)",
  border: "none",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  borderRadius: "22px",
  position: "relative",
  overflow: "hidden",
  padding: "2rem",
};

const Goals = ({ goals, setGoals }) => {
  return (
    <div className="my-5 mx-auto">
      <div style={cardStyle}>
        <GoalsOverview goals={goals} setGoals={setGoals} />
      </div>
    </div>
  );
};

export default Goals;
