const pool = require('../config/db');

// Get all hardware requests (with branch info)
exports.getAllRequests = async () => {
  const sql = `
  SELECT 
    hr.*, 
    b.branch_name, 
    u.user_id AS created_by_id, 
    u.username AS created_by_username, 
    u.full_name AS created_by_name, 
    u.email AS created_by_email, 
    u.role AS created_by_role,
    
    ea.assignment_id,
    ea.engineer_id,
    ea.assigned_by,
    ea.assign_date,
    ea.remarks AS assignment_remarks,
    ea.status AS assignment_status,
    
    he.name AS engineer_name,
    he.contact_number AS engineer_contact,
    he.email AS engineer_email,
    he.designation AS engineer_designation,
    he.availability AS engineer_availability,
    he.created_at AS engineer_created_at

  FROM hardware_request hr
  LEFT JOIN branch_office b 
    ON hr.branch_id = b.branch_id
  LEFT JOIN users u 
    ON hr.created_by = u.user_id
  LEFT JOIN engineer_assignment ea 
    ON hr.request_id = ea.request_id
  LEFT JOIN hardware_engineer he 
    ON ea.engineer_id = he.engineer_id

  ORDER BY hr.request_id DESC
  `;

  const [rows] = await pool.query(sql);
  return rows;
};


// Get single hardware request by ID
exports.getRequestById = async (id) => {
  const sql = `
    SELECT 
      hr.*, 
      b.branch_name, 
      ea.assignment_id,
      ea.engineer_id,
      ea.assigned_by,
      ea.assign_date,
      ea.remarks AS assignment_remarks,
      ea.status AS assignment_status,
      he.name AS engineer_name,
      he.contact_number AS engineer_contact,
      he.email AS engineer_email,
      he.designation AS engineer_designation,
      he.availability AS engineer_availability
    FROM hardware_request hr
    LEFT JOIN branch_office b 
      ON hr.branch_id = b.branch_id
    LEFT JOIN engineer_assignment ea 
      ON hr.request_id = ea.request_id
    LEFT JOIN hardware_engineer he 
      ON ea.engineer_id = he.engineer_id
    WHERE hr.created_by = ?
    ORDER BY hr.request_id DESC
  `;
  const [rows] = await pool.query(sql, [id]);
  return rows;
};

// Create new hardware request
exports.createRequest = async (data) => {
  const {
    branch_id = null,
    hardware_name,
    problem_details,
    zone_code,
    zone_name,
    branch_code,
    branch_anme, // DB typo kept
    mobile,
    priority,
    created_by
  } = data;

  const sql = `
    INSERT INTO hardware_request (
      branch_id,
      hardware_name,
      problem_details,
      zone_code,
      zone_name,
      branch_code,
      branch_anme,
      mobile,
      priority,
      created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(sql, [
    branch_id,
    hardware_name,
    problem_details,
    zone_code,
    zone_name,
    branch_code,
    branch_anme,
    mobile,
    priority || 'Medium',
    created_by
  ]);

  return result;
};



// Update hardware request
exports.updateRequest = async (id, data) => {
  const { status } = data;

  const sql = `
    UPDATE hardware_request 
    SET  status = ?
    WHERE request_id = ?
  `;
  const [result] = await pool.query(sql, [ status, id]);
  return result;
};

// Delete hardware request
exports.deleteRequest = async (id) => {
  const [result] = await pool.query("DELETE FROM hardware_request WHERE request_id = ?", [id]);
  return result;
};



exports.getDashboardCounts = async () => {
    // 1. Define all SQL Queries
    const appSql = 'SELECT count(*) as total_application FROM hardware_request';
    const engSql = 'SELECT count(*) as total_engineer FROM hardware_engineer';
    const inprogressSql = 'SELECT count(*) as total_inprogress FROM hardware_request where status="In Progress"';
    const completedSql = 'SELECT count(*) as total_completed FROM hardware_request where status="Completed"';
    const assignedSql = 'SELECT count(*) as total_assigned FROM hardware_request where status="Assigned"'; // ⭐️ NEW SQL QUERY ⭐️

    // 2. Execute all five queries concurrently using Promise.all()
    const [appResult, engResult, inprogressResult, completedResult, assignedResult] = await Promise.all([ // ⭐️ Capture new result ⭐️
        pool.query(appSql),
        pool.query(engSql),
        pool.query(inprogressSql),
        pool.query(completedSql),
        pool.query(assignedSql) // ⭐️ Added new query to array ⭐️
    ]);

    // 3. Extract the rows from the results
    const appRows = appResult[0];
    const engRows = engResult[0];
    const inprogressRows = inprogressResult[0];
    const completedRows = completedResult[0];
    const assignedRows = assignedResult[0]; // ⭐️ Extract new rows ⭐️

    // 4. Return a single object with all counts
    return {
        total_application: appRows[0].total_application,
        total_engineer: engRows[0].total_engineer,
        total_inprogress: inprogressRows[0].total_inprogress,
        total_completed: completedRows[0].total_completed,
        total_assigned: assignedRows[0].total_assigned, // ⭐️ Include new count in final object ⭐️
    };
};


exports.getUserStatusCounts = async (userId) => {
  const inprogressSql = `
    SELECT COUNT(*) AS total_inprogress 
    FROM hardware_request 
    WHERE status="In Progress" AND created_by = ?
  `;
  const completedSql = `
    SELECT COUNT(*) AS total_completed 
    FROM hardware_request 
    WHERE status="Completed" AND created_by = ?
  `;
  const assignedSql = `
    SELECT COUNT(*) AS total_assigned 
    FROM hardware_request 
    WHERE status="Assigned" AND created_by = ?
  `;
  const pendingSql = `
    SELECT COUNT(*) AS total_pending 
    FROM hardware_request 
    WHERE status="Pending" AND created_by = ?
  `;

  // Execute all queries concurrently
  const [inprogressResult, completedResult, assignedResult, pendingResult] = await Promise.all([
    pool.query(inprogressSql, [userId]),
    pool.query(completedSql, [userId]),
    pool.query(assignedSql, [userId]),
    pool.query(pendingSql, [userId])
  ]);

  return {
    total_inprogress: inprogressResult[0][0].total_inprogress,
    total_completed: completedResult[0][0].total_completed,
    total_assigned: assignedResult[0][0].total_assigned,
    total_pending: pendingResult[0][0].total_pending  // ✅ Added Pending
  };
};

