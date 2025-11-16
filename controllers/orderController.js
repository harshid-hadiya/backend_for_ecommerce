const mysqlConnection = require('../config/mysqlConnection');

// Create a new order
exports.createOrder = (req, res) => {
  const { userId, total, items } = req.body;

  const orderQuery = 'INSERT INTO orders (userId, total) VALUES (?, ?)';
  mysqlConnection.query(orderQuery, [userId, total], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error creating order', error: err });
    } else {
      const orderId = results.insertId;
      const orderItemsQuery = 'INSERT INTO order_items (orderId, productId, quantity, priceAtPurchase) VALUES ?';
      const orderItemsData = items.map(item => [orderId, item.productId, item.quantity, item.priceAtPurchase]);

      mysqlConnection.query(orderItemsQuery, [orderItemsData], (err) => {
        if (err) {
          res.status(500).json({ message: 'Error adding order items', error: err });
        } else {
          res.status(201).json({ message: 'Order created successfully', orderId });
        }
      });
    }
  });
};

// Get orders by date
exports.getOrdersByDate = (req, res) => {
  const { userId } = req.params;
  const { date } = req.query;

  const query = `
    SELECT o.id AS orderId, o.total, o.createdAt, oi.productId, oi.quantity, oi.priceAtPurchase
    FROM orders o
    JOIN order_items oi ON o.id = oi.orderId
    WHERE o.userId = ? AND DATE(o.createdAt) = ?
  `;

  mysqlConnection.query(query, [userId, date], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error fetching orders', error: err });
    } else {
      res.status(200).json(results);
    }
  });
};