const Income = require("../models/Income");
const Expense = require("../models/Expense");

// Helper to determine model by type
const getModel = (type) => {
  if (type === "income") return Income;
  if (type === "expense") return Expense;
  throw new Error("Invalid transaction type");
};

// POST /api/transactions
exports.createTransaction = async (req, res) => {
  try {
    const { type, ...data } = req.body;
    const Model = getModel(type);
    const transaction = await Model.create({ ...data, userId: req.user.id });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/transactions
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const incomes = await Income.find({ userId });
    const expenses = await Expense.find({ userId });
    const all = [
      ...incomes.map((t) => ({ ...t.toObject(), type: "income" })),
      ...expenses.map((t) => ({ ...t.toObject(), type: "expense" })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/transactions/:id
exports.updateTransaction = async (req, res) => {
  try {
    const { type, ...data } = req.body;
    const Model = getModel(type);
    const updated = await Model.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      data,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res) => {
  try {
    // Try both models
    let deleted =
      (await Income.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id,
      })) ||
      (await Expense.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id,
      }));
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
