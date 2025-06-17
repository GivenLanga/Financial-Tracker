import React, { useState } from "react";

const GoalsOverview = ({ goals = [], setGoals }) => {
  const [showForm, setShowForm] = useState(false);
  const [goal, setGoal] = useState({ name: "", target: "", saved: "" });
  const [editIdx, setEditIdx] = useState(null);

  const handleChange = (e) =>
    setGoal({ ...goal, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goal.name || !goal.target) return;
    if (editIdx !== null) {
      // Update existing goal
      setGoals(goals.map((g, i) => (i === editIdx ? goal : g)));
    } else {
      // Add new goal
      setGoals([...goals, goal]);
    }
    setGoal({ name: "", target: "", saved: "" });
    setShowForm(false);
    setEditIdx(null);
  };

  const handleEdit = (idx) => {
    setGoal(goals[idx]);
    setShowForm(true);
    setEditIdx(idx);
  };

  const handleDelete = (idx) => {
    setGoals(goals.filter((_, i) => i !== idx));
    // If deleting the goal being edited, reset form
    if (editIdx === idx) {
      setShowForm(false);
      setEditIdx(null);
      setGoal({ name: "", target: "", saved: "" });
    } else if (editIdx !== null && idx < editIdx) {
      setEditIdx(editIdx - 1);
    }
  };

  return (
    <div className="card mb-4">
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-lg">Financial Goals</h5>
        <button
          className="add-btn"
          onClick={() => {
            setShowForm(!showForm);
            setGoal({ name: "", target: "", saved: "" });
            setEditIdx(null);
          }}
        >
          {showForm ? "Cancel" : "Add Goal"}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2">
          <input
            name="name"
            value={goal.name}
            onChange={handleChange}
            placeholder="Goal name"
            className="input-box"
            required
          />
          <input
            name="target"
            value={goal.target}
            onChange={handleChange}
            placeholder="Target amount"
            type="number"
            className="input-box"
            required
          />
          <input
            name="saved"
            value={goal.saved}
            onChange={handleChange}
            placeholder="Already saved (optional)"
            type="number"
            className="input-box"
          />
          <button className="btn-primary" type="submit">
            {editIdx !== null ? "Update Goal" : "Save Goal"}
          </button>
        </form>
      )}
      <div>
        {goals.length === 0 && (
          <p className="text-xs text-gray-400">No goals yet.</p>
        )}
        {goals.map((g, idx) => {
          const percent = Math.min(
            100,
            Math.round(((+g.saved || 0) / +g.target) * 100)
          );
          return (
            <div key={idx} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium">{g.name}</span>
                <span>{percent}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${percent}%`,
                    background:
                      "linear-gradient(90deg, #a855f7 0%, #facc15 100%)",
                    transition: "width 0.7s cubic-bezier(.4,0,.2,1)",
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-gray-400 mt-0.5">
                <span>Saved: R{g.saved || 0}</span>
                <span>Target: R{g.target}</span>
              </div>
              <div className="flex gap-2 mt-1">
                <button
                  className="text-xs text-blue-500 hover:underline"
                  onClick={() => handleEdit(idx)}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="text-xs text-red-500 hover:underline"
                  onClick={() => handleDelete(idx)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalsOverview;
