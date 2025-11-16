const mysqlConnection = require('./mysqlConnection');
const userSchema = require('../models/User');
const { orderSchema, orderItemSchema } = require('../models/Order');

mysqlConnection.query(userSchema, (err) => {
  if (err) {
    console.error('Error creating users table:', err);
  } else {
    console.log('Users table created or already exists.');
  }
});

mysqlConnection.query(orderSchema, (err) => {
  if (err) {
    console.error('Error creating orders table:', err);
  } else {
    console.log('Orders table created or already exists.');
  }
});

mysqlConnection.query(orderItemSchema, (err) => {
  if (err) {
    console.error('Error creating order_items table:', err);
  } else {
    console.log('Order items table created or already exists.');
  }
});