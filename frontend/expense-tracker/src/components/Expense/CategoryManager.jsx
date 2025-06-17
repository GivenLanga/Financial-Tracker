import React, { useState } from "react";
import { DEFAULT_EXPENSE_CATEGORIES } from "../../utils/data";

const CategoryManager = ({ categories, setCategories }) => {
  const [newCat, setNewCat] = useState("");
  return (
    <div className="mb-4">
      <h5 className="text-lg mb-2">Expense Categories</h5>
      <div className="flex gap-2 flex-wrap mb-2">
        {categories.map((cat, idx) => (
          <span
            key={cat}
            className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs flex items-center gap-1"
          >
            {cat}
            {cat !== "Other" && (
              <button
                className="ml-1 text-red-400 hover:text-red-600"
                onClick={() =>
                  setCategories(categories.filter((c) => c !== cat))
                }
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newCat && !categories.includes(newCat)) {
            setCategories([...categories, newCat]);
            setNewCat("");
          }
        }}
        className="flex gap-2"
      >
        <input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="Add category"
          className="input-box"
        />
        <button className="btn-primary" type="submit">
          Add
        </button>
      </form>
    </div>
  );
};

export default CategoryManager;
