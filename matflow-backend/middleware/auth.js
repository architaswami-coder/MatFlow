const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here');
    req.user = verified; // Contains userId and role
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
    console.log("JWT Error:", err.message);
  }
};

module.exports = verifyToken;