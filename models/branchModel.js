const pool = require('../config/db');

// Get all branches
exports.getAllBranches = async () => {
  const [rows] = await pool.query("SELECT * FROM branch_office ORDER BY branch_id DESC");
  return rows;
};

// Get branch by ID
exports.getBranchById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM branch_office WHERE branch_id = ?", [id]);
  return rows;
};

// Create a new branch
exports.createBranch = async (data) => {
  const { branch_name, address, contact_person, contact_number, email } = data;
  const sql = `
    INSERT INTO branch_office (branch_name, address, contact_person, contact_number, email)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await pool.query(sql, [branch_name, address, contact_person, contact_number, email]);
  return result;
};

// Update existing branch
exports.updateBranch = async (id, data) => {
  const { branch_name, address, contact_person, contact_number, email } = data;
  const sql = `
    UPDATE branch_office 
    SET branch_name = ?, address = ?, contact_person = ?, contact_number = ?, email = ?
    WHERE branch_id = ?
  `;
  const [result] = await pool.query(sql, [branch_name, address, contact_person, contact_number, email, id]);
  return result;
};

// Delete branch
exports.deleteBranch = async (id) => {
  const [result] = await pool.query("DELETE FROM branch_office WHERE branch_id = ?", [id]);
  return result;
};
