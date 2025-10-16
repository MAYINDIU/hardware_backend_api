const pool = require('../config/db');

/**
 * Retrieves all offices from the database.
 * Includes office ID for reference.
 * @returns {Promise<Array>} A promise that resolves to an array of office records.
 */
const getAllOffices = async () => {
    try {
        // Added 'id' and full columns to the SELECT query for completeness
        const [rows] = await pool.query('SELECT id, office_name, address, contact_person, phone, email FROM offices ORDER BY id ASC');
        return rows;
    } catch (err) {
        // Log error and re-throw for controller to handle
        console.error('Error fetching offices:', err.message);
        throw err;
    }
};

/**
 * Inserts a new office record into the database.
 * @param {object} office - Object containing office details.
 * @returns {Promise<number>} A promise that resolves to the insertId of the new record.
 */
async function createOffice(office) {
    const { office_name, address, contact_person, phone, email } = office;

    try {
        const [res] = await pool.query(
            'INSERT INTO offices (office_name, address, contact_person, phone, email) VALUES (?, ?, ?, ?, ?)',
            [office_name, address, contact_person, phone, email]
        );

        return res.insertId;
    } catch (err) {
        console.error('Error creating office:', err.message);
        throw err;
    }
}


module.exports = { getAllOffices, createOffice };
