const pool = require('../config/db');

async function createReport({ assignment_id, work_details, parts_changed, repair_status }) {
  const [res] = await pool.query(
    `INSERT INTO repair_reports (assignment_id, work_details, parts_changed, repair_status) VALUES (?, ?, ?, ?)`,
    [assignment_id, work_details, parts_changed, repair_status]
  );
  return res.insertId;
}

async function findByAssignment(assignment_id) {
  const [rows] = await pool.query('SELECT * FROM repair_reports WHERE assignment_id=?', [assignment_id]);
  return rows;
}

module.exports = { createReport, findByAssignment };
