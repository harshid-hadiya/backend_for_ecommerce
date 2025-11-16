const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysqlConnection = require('../config/mysqlConnection');

// User registration
exports.registerUser = (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = 'INSERT INTO users (name, email, passwordHash, role) VALUES (?, ?, ?, ?)';
  mysqlConnection.query(query, [name, email, hashedPassword, role], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error registering user', error: err });
    } else {
      res.status(201).json({ message: 'User registered successfully', userId: results.insertId });
    }
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  mysqlConnection.query(query, [email], (err, results) => {
    if (err || results.length === 0) {
      res.status(401).json({ message: 'Invalid email or password' });
    } else {
      const user = results[0];
      const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);

      if (isPasswordValid) {
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    }
  });
};