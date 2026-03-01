const { pool } = require('../config/db'); // This extracts ONLY the MySQL pool


// Get all assignments with request, branch, and engineer details
exports.getAllAssignments = async () => {
  const sql = `
    SELECT ea.*, 
           hr.hardware_name, hr.problem_details, hr.eng_comments, hr.status AS request_status, 
           b.branch_name,
           he.name AS engineer_name, he.contact_number AS engineer_contact,
           u.full_name AS assigned_by_name
    FROM engineer_assignment ea
    LEFT JOIN hardware_request hr ON ea.request_id = hr.request_id
    LEFT JOIN branch_office b ON hr.branch_id = b.branch_id
    LEFT JOIN hardware_engineer he ON ea.engineer_id = he.engineer_id
    LEFT JOIN users u ON ea.assigned_by = u.user_id
    ORDER BY ea.assignment_id DESC
  `;
  const [rows] = await pool.query(sql);
  return rows;
};

// Get single assignment by ID
exports.getAssignmentById = async (id) => {
  const sql = `
    SELECT ea.*, 
           hr.hardware_name, hr.problem_details,hr.eng_comments, hr.status AS request_status, 
           b.branch_name,
           he.name AS engineer_name, he.contact_number AS engineer_contact,
           u.full_name AS assigned_by_name
    FROM engineer_assignment ea
    LEFT JOIN hardware_request hr ON ea.request_id = hr.request_id
    LEFT JOIN branch_office b ON hr.branch_id = b.branch_id
    LEFT JOIN hardware_engineer he ON ea.engineer_id = he.engineer_id
    LEFT JOIN users u ON ea.assigned_by = u.user_id
    WHERE ea.engineer_id = ?
  `;
  const [rows] = await pool.query(sql, [id]);
  return rows;
};

// Create new assignment
exports.createAssignment = async (data) => {
  const { request_id, engineer_id, assigned_by, remarks, status } = data;
  const sql = `
    INSERT INTO engineer_assignment (request_id, engineer_id, assigned_by, remarks, status)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await pool.query(sql, [request_id, engineer_id, assigned_by, remarks, status || 'Assigned']);
  return result;
};

// Update assignment
exports.updateAssignment = async (id, data) => {
  const { engineer_id, remarks, status } = data;
  const sql = `
    UPDATE engineer_assignment 
    SET engineer_id = ?, remarks = ?, status = ?
    WHERE assignment_id = ?
  `;
  const [result] = await pool.query(sql, [engineer_id, remarks, status, id]);
  return result;
};

// Delete assignment
exports.deleteAssignment = async (id) => {
  const [result] = await pool.query("DELETE FROM engineer_assignment WHERE assignment_id = ?", [id]);
  return result;
};
