import React, { useState } from "react";

const SavingsOverview = ({ savings = 0, onAddSaving }) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount) {
      onAddSaving(Number(amount));
      setAmount("");
    }
  };

  return (
    <div className="card mb-4">
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-lg">Savings</h5>
      </div>
      <div className="mb-2">
        <span className="text-2xl font-bold text-purple-700">R{savings}</span>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Add to savings"
          className="input-box"
        />
        <button className="btn-primary" type="submit">
          Add
        </button>
      </form>
    </div>
  );
};

export default SavingsOverview;
