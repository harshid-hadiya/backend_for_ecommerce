const mysql = require('mysql2');

const orderSchema = `
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  total FLOAT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
`;

const orderItemSchema = `
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL,
  productId VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  priceAtPurchase FLOAT NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders(id)
);
`;

module.exports = { orderSchema, orderItemSchema };