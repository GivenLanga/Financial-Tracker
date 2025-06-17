import React, { useState, useEffect } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddIncomeForm = ({ onAddIncome, initialData = {}, isEdit }) => {
  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: "",
    icon: "",
    notes: "",
    _id: undefined,
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setIncome({
        source: initialData.source || "",
        amount: initialData.amount || "",
        date: initialData.date || "",
        icon: initialData.icon || "",
        notes: initialData.notes || "",
        _id: initialData._id,
      });
    }
    // Do not reset to blank on every render if initialData is empty
    // eslint-disable-next-line
  }, [initialData]);

  const handleChange = (key, value) => {
    setIncome((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddIncome(income);
    // Do not reset form here; let parent close modal and reset if needed
  };

  return (
    <form onSubmit={handleSubmit}>
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={income.source}
        onChange={({ target }) => handleChange("source", target.value)}
        label="Income Source"
        placeholder="Freelance, Salary, etc"
        type="text"
      />

      <Input
        value={income.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder=""
        type="number"
      />

      <Input
        value={income.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />

      <Input
        value={income.notes}
        onChange={({ target }) => handleChange("notes", target.value)}
        label="Notes"
        placeholder="Optional notes"
        type="text"
      />

      <div className="flex justify-end mt-6">
        <button type="submit" className="add-btn add-btn-fill">
          {isEdit ? "Update Income" : "Add Income"}
        </button>
      </div>
    </form>
  );
};

export default AddIncomeForm;
