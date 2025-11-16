const express = require('express');
const { getAllProducts, createProduct } = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all products
router.get('/', getAllProducts);

// Create a new product (admin only)
router.post('/', verifyToken, isAdmin, createProduct);

module.exports = router;