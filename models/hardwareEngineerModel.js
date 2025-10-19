const pool = require('../config/db');

// Get all engineers
exports.getAllEngineers = async () => {
  const sql = "SELECT * FROM hardware_engineer ORDER BY engineer_id DESC";
  const [rows] = await pool.query(sql);
  return rows;
};

// Get single engineer by ID
exports.getEngineerById = async (id) => {
  const sql = "SELECT * FROM hardware_engineer WHERE engineer_id = ?";
  const [rows] = await pool.query(sql, [id]);
  return rows;
};

// Create new engineer
exports.createEngineer = async (data) => {
  const { name, contact_number, email, designation, availability } = data;
  const sql = `
    INSERT INTO hardware_engineer (name, contact_number, email, designation, availability)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await pool.query(sql, [name, contact_number, email, designation, availability || 'Available']);
  return result;
};

// Update engineer
exports.updateEngineer = async (id, data) => {
  const { name, contact_number, email, designation, availability } = data;
  const sql = `
    UPDATE hardware_engineer
    SET name = ?, contact_number = ?, email = ?, designation = ?, availability = ?
    WHERE engineer_id = ?
  `;
  const [result] = await pool.query(sql, [name, contact_number, email, designation, availability, id]);
  return result;
};

// Delete engineer
exports.deleteEngineer = async (id) => {
  const [result] = await pool.query("DELETE FROM hardware_engineer WHERE engineer_id = ?", [id]);
  return result;
};
