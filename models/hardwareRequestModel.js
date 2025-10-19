const pool = require('../config/db');

// Get all hardware requests (with branch info)
exports.getAllRequests = async () => {
  const sql = `
  SELECT 
    hr.*, 
    b.branch_name, 
    u.user_id, 
    u.username, 
    u.full_name, 
    u.email, 
    u.role
FROM hardware_request hr
LEFT JOIN branch_office b ON hr.branch_id = b.branch_id
LEFT JOIN users u ON hr.created_by = u.user_id
ORDER BY hr.request_id DESC
  `;
  const [rows] = await pool.query(sql);
  return rows;
};

// Get single hardware request by ID
exports.getRequestById = async (id) => {
  const sql = `
    SELECT hr.*, b.branch_name 
    FROM hardware_request hr
    LEFT JOIN branch_office b ON hr.branch_id = b.branch_id
    WHERE hr.request_id = ?
  `;
  const [rows] = await pool.query(sql, [id]);
  return rows;
};

// Create new hardware request
exports.createRequest = async (data) => {
  const { branch_id, hardware_name, problem_details, priority, created_by } = data;

  const sql = `
    INSERT INTO hardware_request (branch_id, hardware_name, problem_details, priority, created_by)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await pool.query(sql, [branch_id, hardware_name, problem_details, priority, created_by]);
  return result;
};

// Update hardware request
exports.updateRequest = async (id, data) => {
  const { hardware_name, problem_details, priority, status } = data;

  const sql = `
    UPDATE hardware_request 
    SET hardware_name = ?, problem_details = ?, priority = ?, status = ?
    WHERE request_id = ?
  `;
  const [result] = await pool.query(sql, [hardware_name, problem_details, priority, status, id]);
  return result;
};

// Delete hardware request
exports.deleteRequest = async (id) => {
  const [result] = await pool.query("DELETE FROM hardware_request WHERE request_id = ?", [id]);
  return result;
};
