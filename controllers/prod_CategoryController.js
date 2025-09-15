const { categories } = require("../models/categoriesModel");

// utility function
const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 10); // 8-char alphanumeric
};

const createCategory = (req, res) => {
  try {
    const { name } = req.body;
    const category_id = generateRandomId(); // auto-generate

    categories.create({ name, category_id }, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        message: "Category created",
        id: result.insertId,
        category_id
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getAllCategory = (req, res) => {
  try {
    categories.getAll((err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createCategory, getAllCategory };
