const { pool } = require('../config/db'); // This extracts ONLY the MySQL pool

// Create new user
exports.createUser = async (data) => {
  const {
    username,
    password,
    full_name,
    email,
    department,
    zone_code,
    zone_name,
    branch_code,
    branch_anme, // keep same as DB field
    role,
    branch_id
  } = data;

  const sql = `
    INSERT INTO users (
      username,
      password,
      full_name,
      email,
      department,
      zone_code,
      zone_name,
      branch_code,
      branch_anme,
      role,
      branch_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(sql, [
    username,
    password,
    full_name,
    email,
    department,
    zone_code,
    zone_name,
    branch_code,
    branch_anme,
    role,
    branch_id
  ]);

  return result;
};





// Get all users
// Fetch all users (Promise style)
exports.getAllUsers = async () => {
  const [rows] = await pool.query('SELECT * FROM users');
  return rows;
};





// Get Works Details by Engineer ID
exports.getWorkslistById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM hardware_problem_entry WHERE Eng_id = ?", [id]);
  return rows;
};



// Update status hardware request
exports.updateRequest = async (id, data) => {
  const { status } = data;

  const sql = `
    UPDATE hardware_problem_entry 
    SET  status = ?
    WHERE ID = ?
  `;
  const [result] = await pool.query(sql, [ status, id]);
  return result;
};



// Update engineer comments
exports.updateEngineerComments = async (id, data) => {
  const { eng_comments } = data;

  const sql = `
    UPDATE hardware_problem_entry 
    SET  eng_comments = ?
    WHERE ID = ?
  `;
  const [result] = await pool.query(sql, [ eng_comments, id]);
  return result;
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
  const sql = `
    SELECT 
      u.user_id,
      u.username,
      u.password,
      u.zone_name,
      u.branch_anme,
      u.department,
      u.zone_code,
      u.branch_code,
      u.full_name,
      u.email AS user_email,
      u.role,
      u.created_at,
      he.engineer_id,
      he.name AS engineer_name,
      he.contact_number,
      he.email AS engineer_email,
      he.designation,
      he.availability
    FROM users u
    LEFT JOIN hardware_engineer he 
      ON u.user_id = he.user_id
    WHERE u.username = ? AND u.password = ?
    ORDER BY he.designation ASC
  `;

  const [rows] = await pool.query(sql, [username, password]);
  return rows;
};
