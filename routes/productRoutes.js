const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, adminDashboard , } = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all products
router.get('/', getAllProducts);

// Create a new product (admin only)
router.post('/', verifyToken, isAdmin, createProduct);
router.put('/:id', verifyToken, isAdmin, updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);
router.get("/dashboard", adminDashboard);

module.exports = router;