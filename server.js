const dotenv = require("dotenv").config();
const app = require("./app");
// Rename 'connection' to 'pool' for clarity, as config/db.js exports a pool
const pool = require("./config/db"); 

// mysql database connection check (using promise-based pool pattern)
pool.getConnection()
    .then(conn => {
        // If successful, the connection object is here
        console.log("Connected to MySQL server");
        conn.release(); // IMPORTANT: Release the connection back to the pool immediately after testing
    })
    .catch(err => {
        // If the server is down or credentials are wrong, the error is caught here
        console.error("Error connecting to MySQL:", err.message);
    });

// server port Connection
const port = process.env.PORT || 6002;

app.listen(port, () => {
    console.log(`App is running on port http://localhost:${port}`);
});