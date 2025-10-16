const pool = require('../config/db');

/**
 * Logs a status change event for a piece of hardware.
 * @param {object} logData - The log data.
 * @param {number} logData.hardware_item_id - The ID of the hardware item.
 * @param {string} logData.status - The new status.

 */
async function log({ hardware_item_id, status = null }) {
    // Note: The hardware_status_logs table likely has a 'changed_at' column set to NOW() by default.
    await pool.query(
        'INSERT INTO hardware_status_logs (hardware_item_id, status) VALUES (?, ?)', 
        [hardware_item_id, status]
    );
}

module.exports = { log };
