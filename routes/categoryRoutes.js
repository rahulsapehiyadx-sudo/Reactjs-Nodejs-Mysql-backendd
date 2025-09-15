const express = require('express')
const router = express.Router()
const { createCategory, getAllCategory } = require('../controllers/prod_CategoryController')
const {authMiddleware} = require('../middleware/authMiddleware')


router.post('/createCategory', authMiddleware, createCategory)
router.get('/getAllCategory', authMiddleware, getAllCategory)

module.exports = router; 