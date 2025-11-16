const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];
  

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
        console.log(err);
        console.log(token);
        
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// Middleware to check admin role
exports.isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};