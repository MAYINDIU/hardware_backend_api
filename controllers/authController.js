const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
// NOTE: Ensure your SECRET is exported correctly from this middleware file
const { SECRET } = require('../middlewares/auth'); 

const SALT_ROUNDS = 10;

/**
 * Handles user registration.
 * Expects: name, email, password (in req.body).
 */
async function register(req, res) {
    try {
        // Line 13: Safely destructures req.body (assuming app.js has express.json() middleware)
        const { name, email, password, role = 'office_user', office_id = null } = req.body;
        
        // Input Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields: name, email, and password.' });
        }

        // Check if user (email) already exists
        let existsRows = [];
        try {
            // REVERTED: Using standard array destructuring, which is safer 
            // and relies on the try/catch block to properly handle query failures.
            const [rows] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
            existsRows = rows;
        } catch (queryError) {
            // This catches SQL errors or connection errors specific to this query
            console.error('DB Exists Check Error:', queryError);
            const errorDetail = queryError.message || String(queryError);
            // Re-throw to be caught by the main catch block
            throw new Error(`Database error during user existence check: ${errorDetail}`); 
        }
        
        if (existsRows.length) {
            return res.status(400).json({ message: 'Email already used' });
        }

        // Hash password and insert new user
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        
        let result = {};
        try {
            // REVERTED: Using standard array destructuring.
            const [insertResult] = await pool.query(
                'INSERT INTO users (name, email, password, role, office_id) VALUES (?, ?, ?, ?, ?)', 
                [name, email, passwordHash, role, office_id]
            );
            result = insertResult;
        } catch (queryError) {
            // This catches SQL errors or connection errors specific to the insert
            console.error('DB Insert Error:', queryError);
            const errorDetail = queryError.message || String(queryError);
            throw new Error(`Database error during user insertion: ${errorDetail}`);
        }
        
        const userId = result.insertId;
        const token = jwt.sign({ id: userId }, SECRET, { expiresIn: '1d' });
        
        // Respond with the generated token and user data
        res.status(201).json({ 
            token, 
            user: { id: userId, name, email, role, office_id } 
        });
    } catch (err) {
        // Log the error for debugging and send a generic 500 response
        console.error('Registration Error:', err);
        // The message now includes the specific database error if it was caught and re-thrown
        res.status(500).json({ message: 'Error registering user', details: err.message });
    }
}

/**
 * Handles user login and session creation (JWT).
 * Expects: email, password (in req.body).
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;
        
        // Input Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Missing required fields: email and password.' });
        }
        
        // Find user by email
        let rows = [];
        try {
            // REVERTED: Using standard array destructuring.
            const [fetchedRows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
            rows = fetchedRows;
        } catch (queryError) {
            console.error('DB Login Check Error:', queryError);
            const errorDetail = queryError.message || String(queryError);
            throw new Error(`Database error during user lookup: ${errorDetail}`);
        }
        
        if (!rows.length) {
            // Use 401 Unauthorized for failed login attempts
            return res.status(401).json({ message: 'Invalid credentials' }); 
        }
        
        const user = rows[0];
        
        // Compare password hash
        const ok = await bcrypt.compare(password, user.password); 
        
        if (!ok) {
            return res.status(401).json({ message: 'Invalid credentials' }); 
        }
        
        // Sign JWT token
        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1d' });
        
        // Respond with token and limited user data
        res.json({ 
            token, 
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                office_id: user.office_id 
            } 
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Error logging in', details: err.message });
    }
}

module.exports = { register, login };
