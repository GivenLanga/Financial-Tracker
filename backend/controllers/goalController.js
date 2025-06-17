const Goal = require("../models/Goal");

// POST /api/goals
exports.createGoal = async (req, res) => {
  try {
    const { name, target, saved } = req.body;
    const goal = await Goal.create({
      userId: req.user.id,
      name,
      target,
      saved,
    });
    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/goals
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/goals/:id
exports.updateGoal = async (req, res) => {
  try {
    const { name, target, saved } = req.body;
    const updated = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, target, saved },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/goals/:id
exports.deleteGoal = async (req, res) => {
  try {
    const deleted = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
