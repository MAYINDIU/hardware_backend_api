const pool = require('../config/db');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
  return rows[0];
}

async function findById(id) {
  const [rows] = await pool.query('SELECT id, name, email, role, office_id, created_at FROM users WHERE id=?', [id]);
  return rows[0];
}

async function create(user) {
  const { name, email, passwordHash, role = 'office_user', office_id = null } = user;
  const [res] = await pool.query('INSERT INTO users (name, email, password, role, office_id) VALUES (?, ?, ?, ?, ?)', [name, email, passwordHash, role, office_id]);
  return res.insertId;
}

module.exports = { findByEmail, create, findById };
