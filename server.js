const dotenv = require("dotenv").config();
const app = require("./app");
// Destructure both the MySQL pool and the Oracle connection function
const { pool, connectToOracle } = require("./config/db"); 

// 1. MySQL Database Connection Check
pool.getConnection()
    .then(conn => {
        console.log("✅ Connected to MySQL server");
        conn.release(); 
    })
    .catch(err => {
        console.error("❌ Error connecting to MySQL:", err.message);
    });

// 2. Oracle Database Connection Check
const checkOracle = async () => {
    try {
        const conn = await connectToOracle();
        console.log("✅ Connected to Oracle Database (ORA1)");
        await conn.close(); // Always close Oracle connections manually
    } catch (err) {
        console.error("❌ Error connecting to Oracle:", err.message);
    }
};

checkOracle();

// Server Port Connection
// Note: You have PORT1=3002 in your .env, so let's check for that too
const port = process.env.PORT || process.env.PORT1 || 6002;

app.listen(port, () => {
    console.log(`🚀 App is running on http://localhost:${port}`);
});