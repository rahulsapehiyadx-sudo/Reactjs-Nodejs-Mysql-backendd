const express = require('express')
const router = express.Router();
const { createProduct, getProducts, getProductsById,  updateProduct, deleteProduct } = require('../controllers/productController');
const {authMiddleware }= require('../middleware/authMiddleware')

router.post('/create-product',authMiddleware, createProduct)
router.get('/getAll-product', authMiddleware, getProducts)
router.get('/getProductby-Id/:id', authMiddleware, getProductsById)
router.put('/updateProductby-Id/:id', authMiddleware, updateProduct)
router.delete('/deleteProductby-Id/:id', authMiddleware, deleteProduct)

module.exports = router; 