const { product } = require("../models/productModel");
const product_images = require("../models/productImagesModel");
const db = require("../config/db");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// Create Product controller
const createProduct = async (req, res) => {
  product.create(req.body, async (err, result) => {
    // console.log("🔥 req.body:", req.body);
    // console.log("🔥 req.files:", req.files);
    if (err) return res.status(500).json({ error: err.message });

    const product_id = result.insertId;
    let uploadedImages = [];

    try {
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "product_images",
          });

          uploadedImages.push(uploadResult.secure_url);

          // Save in DB
          product_images.createWithImage(
            product_id,
            uploadResult.secure_url,
            () => {}
          );

          fs.unlinkSync(file.path); // cleanup
        }
      }

      res.json({
        message: "Product created successfully",
        id: product_id,
        images: uploadedImages,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

//  Get All products controller
const getProducts = (req, res) => {
  product.getAll((err, results) => {
    if (err) res.status(500).json({ error: err.message });
    // For each product, fetch its images
    const productsWithImages = [];
    let pending = results.length;

    if (!pending) return res.json([]);

    results.forEach((p) => {
      product_images.getByProductId(p.id, (err, images) => {
        if (!err) {
          p.images = images.map((img) => img.image_url);
        } else {
          p.images = [];
        }
        productsWithImages.push(p);

        if (!--pending) res.json(productsWithImages);
      });
    });
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
