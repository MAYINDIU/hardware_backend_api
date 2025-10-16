const pool = require('../config/db');

/**
 * Creates a new hardware transfer request.
 * @param {object} item - The transfer data.
 * @returns {number} The ID of the newly inserted request.
 */
async function create(item) {
    // Applied user's intent: removed attachment, made created_by optional (defaulting to null)
    const { hardware_item_id, from_office_id, reason, problem_description, created_by = null } = item;
    
    // --- ADDED INPUT VALIDATION FOR REQUIRED FIELD ---
    if (!hardware_item_id) {
        // Throw an error early if the mandatory field is missing, preventing a SQL error.
        throw new Error("Validation Error: hardware_item_id is required for transfer creation.");
    }
    // --------------------------------------------------
    
    // Corrected SQL query to match 6 columns with 5 dynamic parameters + 1 static status value
    const [res] = await pool.query(
        `INSERT INTO transfers
         (hardware_item_id, from_office_id, reason, problem_description, status, created_by)
         VALUES (?, ?, ?, ?, 'Sent to Head Office', ?)`,
        [hardware_item_id, from_office_id, reason, problem_description, created_by]
    );
    return res.insertId;
}

/**
 * Finds a transfer request by its ID.
 * @param {number} id - The ID of the request to find.
 * @returns {object|undefined} The transfer object with hardware details.
 */
async function findById(id) {
    // Corrected join condition from tr.hardware_id to tr.hardware_item_id
    const [rows] = await pool.query('SELECT tr.*, h.asset_tag, h.serial_number FROM transfers tr JOIN hardware_items h ON h.id = tr.hardware_item_id WHERE tr.id=?', [id]);
    return rows[0];
}

/**
 * Lists transfer requests with optional filters.
 * @param {object} filters - Filtering options (e.g., status, office_id).
 * @returns {Array<object>} List of transfer request objects.
 */
async function list(filters = {}) {
    // Corrected join condition from tr.hardware_id to tr.hardware_item_id
    let sql = 'SELECT tr.*, h.asset_tag, h.serial_number, o.office_name FROM transfers tr JOIN hardware_items h ON h.id = tr.hardware_item_id JOIN offices o ON tr.from_office_id=o.id';
    const params = [];
    
    // Start of WHERE clause logic
    let whereClauses = [];

    if (filters.status) {
        whereClauses.push('tr.status = ?');
        params.push(filters.status);
    }
    
    // Example of filtering by the office the transfer originated from
    if (filters.from_office_id) {
        whereClauses.push('tr.from_office_id = ?');
        params.push(filters.from_office_id);
    }
    
    if (whereClauses.length > 0) {
        sql += ' WHERE ' + whereClauses.join(' AND ');
    }

    sql += ' ORDER BY tr.created_at DESC';
    const [rows] = await pool.query(sql, params);
    return rows;
}

/**
 * Updates the status of a specific transfer request.
 * NOTE: Corrected table name from transfer_requests to transfers for consistency.
 * @param {number} id - The ID of the request to update.
 * @param {string} status - The new status value.
 */
async function updateStatus(id, status) {
    await pool.query('UPDATE transfers SET status=?, updated_at=NOW() WHERE id=?', [status, id]);
}

module.exports = { create, findById, list, updateStatus };
