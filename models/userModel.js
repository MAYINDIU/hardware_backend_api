const pool = require('../config/db');

// Create new user
exports.createUser = async (data) => {
  const { username, password, full_name, email, role, branch_id } = data;

  const sql = `
    INSERT INTO users (username, password, full_name, email, role, branch_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(sql, [username, password, full_name, email, role, branch_id]);
  return result;
};




// Get all users
// Fetch all users (Promise style)
exports.getAllUsers = async () => {
  const [rows] = await pool.query('SELECT * FROM users');
  return rows;
};

// Get user by ID
exports.getUserById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [id]);
  return rows;
};

// Update user by ID
exports.updateUser = async (id, data) => {
  const { full_name, email, role, branch_id } = data;

  const sql = `
    UPDATE users 
    SET full_name = ?, email = ?, role = ?, branch_id = ?
    WHERE user_id = ?
  `;

  const [result] = await pool.query(sql, [full_name, email, role, branch_id, id]);
  return result;
};

// Delete user
exports.deleteUser = (id, callback) => {
  pool.query("DELETE FROM users WHERE user_id = ?", [id], callback);
};

// Authenticate user
exports.loginUser = async (username, password) => {
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  const [rows] = await pool.query(sql, [username, password]);
  return rows;
};