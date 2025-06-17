import React, { useState, useEffect } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddExpenseForm = ({ onAddExpense, initialData = {}, isEdit }) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "",
    notes: "",
    _id: undefined,
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setExpense({
        category: initialData.category || "",
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
    setExpense((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddExpense(expense);
    // Do not reset form here; let parent close modal and reset if needed
  };

  return (
    <form onSubmit={handleSubmit}>
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={expense.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label="Category"
        placeholder="Rent, Groceries, etc"
        type="text"
      />

      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder=""
        type="number"
      />

      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />

      <Input
        value={expense.notes}
        onChange={({ target }) => handleChange("notes", target.value)}
        label="Notes"
        placeholder="Optional notes"
        type="text"
      />

      <div className="flex justify-end mt-6">
        <button type="submit" className="add-btn add-btn-fill">
          {isEdit ? "Update Expense" : "Add Expense"}
        </button>
      </div>
    </form>
  );
};

export default AddExpenseForm;
