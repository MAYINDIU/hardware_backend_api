const mysql = require('mysql2/promise');
const oracledb = require('oracledb');
require('dotenv').config();

// 1. Initialize Oracle Thick Mode
try {
    oracledb.initOracleClient({ libDir: 'C:\\instantclient_21_3' });
    console.log("✅ Oracle Instant Client initialized.");
} catch (err) {
    if (!err.message.includes("NJS-077")) {
        console.error("❌ Oracle Client initialization failed:", err.message);
        process.exit(1);
    }
}

// 2. MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'hardware_tracking_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 3. Oracle Connection Function
const connectToOracle = async () => {
    try {
        return await oracledb.getConnection({
            user:          process.env.DB_USER1,
            password:      process.env.DB_PASSWORD1,
            connectString: process.env.DB_CONNECT_STRING
        });
    } catch (err) {
        console.error('❌ Oracle Connection Error:', err.message);
        throw err;
    }
};

// Exporting as 'pool' so your existing 'pool.query' calls work
module.exports = {
    pool ,
    connectToOracle
};