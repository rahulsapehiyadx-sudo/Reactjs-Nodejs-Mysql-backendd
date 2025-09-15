const { product } = require("../models/productModel");

// Create Product controller
const createProduct = (req, res) => {
  product.create(req.body, (err, result) => {
    // console.log(result);

    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product Created:", id: result.insertId });
  });
};

//  Get All products controller
const getProducts = (req, res) => {
  product.getAll((err, results) => {
    if (err) res.status(500).json({ error: err.message });
    res.json(results);
  });
};


// Get Product byId Controller
const getProductsById = (req, res) => {
  product.getById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.length)
      return res.status(404).json({ message: "Product not found" });
    res.json(result[0]);
  });
};

// update Product controller
const updateProduct = (req, res) => {
  product.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product updated" });
  });
};

// Delete product controller
const deleteProduct = (req, res) => {
  product.remove(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  });
};

module.exports = {
  createProduct,
  getProducts,
  getProductsById,
  updateProduct,
  deleteProduct,
};
