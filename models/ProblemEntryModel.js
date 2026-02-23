const pool = require('../config/db');

// Create new entry
// Create new entry
exports.createProblemEntry = async (data) => {
  const { 
    Username, 
    user_id, 
    Inv_number, 
    Office_name, 
    mobile, 
    Problem_title, 
    Problem_des, 
    Eng_name, 
    Eng_id, 
    Ofc_type,
    PC_send_dt,
    zone_name,
    zone_code,
    ofc_code,
    department,
    status // Extract status from data
  } = data;

  const sql = `
    INSERT INTO hardware_problem_entry 
    (
      Username, user_id, Inv_number, Office_name, mobile, 
      Problem_title, Problem_des, Eng_name, Eng_id, Ofc_type, 
      PC_send_dt, zone_name, zone_code, ofc_code, department, status
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(sql, [
    Username, 
    user_id, 
    Inv_number || null, 
    Office_name || null, 
    mobile || null, 
    Problem_title || null, 
    Problem_des || null, 
    Eng_name || null, 
    Eng_id || null, 
    Ofc_type || null, 
    PC_send_dt || null,
    zone_name || null,
    zone_code || null,
    ofc_code || null,
    department || null,
    status || 'Pending' // Default to 'Pending' if no status is provided
  ]);
  
  return result;
};

// Get all entries
exports.getAllProblemEntries = async () => {
  const sql = `SELECT * FROM hardware_problem_entry ORDER BY Entry_date DESC`;
  const [rows] = await pool.query(sql);
  return rows;
};

// Get single entry by ID
exports.getProblemEntryById = async (id) => {
  const sql = `SELECT * FROM hardware_problem_entry WHERE ID = ?`;
  const [rows] = await pool.query(sql, [id]);
  return rows[0];
};



// Update an entry (Edit)
exports.updateProblemEntry = async (id, data) => {
  const { 
    Username, 
    user_id, 
    Inv_number, 
    Office_name, 
    mobile, 
    Problem_title, 
    Problem_des, 
    Eng_name, 
    Eng_id, 
    Ofc_type, 
    Eng_appr_dt, 
    PC_send_dt,
    zone_name,
    zone_code,
    ofc_code,
    department,
    status // Added status field
  } = data;

  const sql = `
    UPDATE hardware_problem_entry 
    SET 
      Username = ?, 
      user_id = ?, 
      Inv_number = ?, 
      Office_name = ?, 
      mobile = ?, 
      Problem_title = ?, 
      Problem_des = ?, 
      Eng_name = ?, 
      Eng_id = ?, 
      Ofc_type = ?, 
      Eng_appr_dt = ?, 
      PC_send_dt = ?,
      zone_name = ?,
      zone_code = ?,
      ofc_code = ?,
      department = ?,
      status = ?
    WHERE ID = ?
  `;

  const [result] = await pool.query(sql, [
    Username, 
    user_id, 
    Inv_number || null, 
    Office_name || null, 
    mobile || null, 
    Problem_title || null, 
    Problem_des || null, 
    Eng_name || null, 
    Eng_id || null, 
    Ofc_type || null, 
    Eng_appr_dt || null, 
    PC_send_dt || null,
    zone_name || null,
    zone_code || null,
    ofc_code || null,
    department || null,
    status || 'Pending', // Added status to the array
    id
  ]);

  return result;
};

// Delete an entry
exports.deleteProblemEntry = async (id) => {
  const [result] = await pool.query("DELETE FROM hardware_problem_entry WHERE ID = ?", [id]);
  return result;
};

