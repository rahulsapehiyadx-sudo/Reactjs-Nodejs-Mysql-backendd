const { categories } = require("../models/categoriesModel");

// utility function
const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 10); // 8-char alphanumeric
};

const createCategory = (req, res) => {
  try {
    const { name, description } = req.body;
    const category_id = generateRandomId(); // auto-generate

    categories.create({ name, category_id, description }, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        message: "Category created",
        id: result.insertId,
        category_id,
        description,
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
      // console.log(results);
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const UpdateCategory = (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    categories.update(id, { name, description }, (err, result) => {

      if (err) return res.status(500).json({ error: err.message });

      // check if row was actually updated
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json({ message: "Category updated successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createCategory, getAllCategory, UpdateCategory };


