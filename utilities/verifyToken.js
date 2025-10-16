const jwt = require('jsonwebtoken');
const {JWT_SECRET}=process.env; // Use the same secret key as in your login function

const verifyToken = (req, res, next) => {


  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided !!!!' });
  }
  
  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    
    req.user = decoded; // Save decoded token to request for use in next middleware/routes
    next();
  });
};

module.exports = verifyToken;
