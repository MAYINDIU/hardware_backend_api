const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const SECRET = process.env.JWT_SECRET || 'supersecretkey';

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Authorization required' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    // fetch user basic data
    const [rows] = await pool.query('SELECT id, name, email, role, office_id FROM users WHERE id=?', [payload.id]);
    if (!rows.length) return res.status(401).json({ message: 'User not found' });
    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
}

function roleGuard(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden — insufficient role' });
    }
    next();
  };
}

module.exports = { authMiddleware, roleGuard, SECRET };
