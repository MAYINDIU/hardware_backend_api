const { pool } = require('../config/db'); // This extracts ONLY the MySQL pool



exports.getEngineerProblemLogs = async (engId) => {
    try {
        const sql = `
            SELECT 
                e.name, 
                e.designation,
                p.*
            FROM hardware_problem_entry p
            LEFT JOIN hardware_engineer e ON CAST(TRIM(p.Eng_id) AS CHAR) = CAST(TRIM(e.engineer_id) AS CHAR)
            WHERE TRIM(p.Eng_id) = ? 
            ORDER BY p.ENTRY_DATE DESC 
            LIMIT 0, 25
        `;

        // Log the exact value being sent to the DB
        console.log("Executing query for ID:", `|${engId}|`); 

        const [rows] = await pool.query(sql, [engId.toString().trim()]);
        return rows;
    } catch (err) {
        console.error("Database Error:", err);
        throw err;
    }
};

// Get all engineers
exports.getAllEngineers = async () => {
  const sql = `
    SELECT 
        he.engineer_id,
        he.user_id,
        he.name AS engineer_name,
        he.contact_number,
        he.email AS engineer_email,
        he.designation,
        he.availability,
        he.created_at,
        u.username,
        u.email AS user_email,
        u.role,
        u.password AS password
    FROM hardware_engineer he
    LEFT JOIN users u ON he.user_id = u.user_id
    ORDER BY he.engineer_id DESC
  `;

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
// exports.createEngineer = async (data) => {
//   const { name, contact_number, email, designation, availability } = data;
//   const sql = `
//     INSERT INTO hardware_engineer (name, contact_number, email, designation, availability)
//     VALUES (?, ?, ?, ?, ?)
//   `;
//   const [result] = await pool.query(sql, [name, contact_number, email, designation, availability || 'Available']);
//   return result;
// };

exports.createEngineerWithUser = async (data) => {
  const {
    name,
    contact_number,
    email,
    designation,
    availability,
    username,
    password,
    branch_id
  } = data;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1️⃣ Create User (role = 'engineer')
    const [userResult] = await connection.query(
      `INSERT INTO users (username, password, full_name, email, role, branch_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, password, name, email, "engineer", branch_id]
    );
    const userId = userResult.insertId;

    // 2️⃣ Create Engineer Linked to that User
    const [engineerResult] = await connection.query(
      `INSERT INTO hardware_engineer (name, contact_number, email, designation, availability, user_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, contact_number, email, designation, availability || "Available", userId]
    );

    await connection.commit();

    return {
      message: "Engineer and user created successfully",
      engineer_id: engineerResult.insertId,
      user_id: userId,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
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
