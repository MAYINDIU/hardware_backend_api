const pool = require('../config/db');

/**
 * Creates a new hardware item record in the database.
 * @param {object} item - The hardware item data.
 * @returns {number} The ID of the newly inserted item.
 */
async function create(item) {
    const { asset_tag, category, brand, model, serial_number, current_office_id, status = 'In Office' } = item;
    
    // Ensure the column names and parameter order match the SQL query
    const [res] = await pool.query(
        `INSERT INTO hardware_items (asset_tag, category, brand, model, serial_number, status, current_office_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [asset_tag, category, brand, model, serial_number, status, current_office_id]
    );
    return res.insertId;
}

/**
 * Finds a hardware item by its ID.
 * @param {number} id - The ID of the item to find.
 * @returns {object|undefined} The item object or undefined if not found.
 */
async function findById(id) {
    const [rows] = await pool.query('SELECT * FROM hardware_items WHERE id=?', [id]);
    return rows[0];
}

/**
 * Updates the status of a specific hardware item.
 * @param {number} id - The ID of the item to update.
 * @param {string} status - The new status value.
 */
async function updateStatus(id, status) {
    await pool.query('UPDATE hardware_items SET status=? WHERE id=?', [status, id]);
}

module.exports = { create, findById, updateStatus };
