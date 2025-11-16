const express = require('express');
const { createOrder, getOrdersByDate } = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new order (authenticated users only)
router.post('/', verifyToken, createOrder);

// Get orders by date
router.get('/:userId', verifyToken, getOrdersByDate);

module.exports = router;