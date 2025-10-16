const pool = require('../config/db');

async function create({ transfer_id, engineer_id, assigned_by }) {
  const [res] = await pool.query(
    `INSERT INTO repair_assignments (transfer_id, engineer_id, assigned_by, status) VALUES (?, ?, ?, 'Assigned')`,
    [transfer_id, engineer_id, assigned_by]
  );
  return res.insertId;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM repair_assignments WHERE id=?', [id]);
  return rows[0];
}

async function setStatus(id, status) {
  await pool.query('UPDATE repair_assignments SET status=?, assigned_date=assigned_date WHERE id=?', [status, id]);
}

module.exports = { create, findById, setStatus };
