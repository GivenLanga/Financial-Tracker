const Category = require("../models/Category");

// POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name, userId: req.user.id });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.id });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
