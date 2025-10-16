const mysql = require('mysql2/promise');

// Use createPool for efficiency in Node.js applications
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456', // Consistent with your .env
    database: process.env.DB_NAME || 'hardware_tracking_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
