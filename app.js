// D:\Hardware\hardware_backend\app.js

require('dotenv').config(); // <-- load env variables

const express = require('express');
const bodyParser = require('body-parser'); // Using body-parser as it was in your original snippet
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const cors = require("cors");



// --- Your Local Route/Middleware Imports ---
const logger = require('../hardware_backend/config/logger'); 
const userRoutes = require('./routes/userRoutes');            // implement userRoutes (register/login)
const branchRoutes = require('./routes/branchRoute');            // implement userRoutes (register/login)
const hardwarereqRoutes = require('./routes/hardwareRequestRoutes');            // implement userRoutes (register/login)
const assignemntRoutes = require('./routes/engineerAssignmentRoutes');            // implement userRoutes (register/login)
const hardwareengRoutes = require('./routes/hardwareEngineerRoutes');            // implement userRoutes (register/login)
const problemEntry = require('./routes/ProblemEntryRoute'); 
const hardwareInventory = require('./routes/HardwareInventoryRoutes'); 

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // your React app
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// --- MIDDLEWARE SETUP (CRITICAL FOR req.body) ---
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// Setup Request Logging with Morgan
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}
const logStream = fs.createWriteStream(path.join(logDir, 'requests.log'), { flags: 'a' });
app.use(morgan('combined', { stream: logStream }));

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

// Custom Logger Middleware
app.use(logger);

// --- ROUTE REGISTRATION ---


app.use('/api/users', userRoutes);
app.use('/api/branch', branchRoutes);
app.use('/api/hardware-req', hardwarereqRoutes);
app.use('/api/eng-assign', assignemntRoutes);
app.use('/api/hardware-eng', hardwareengRoutes);
app.use('/api/problem-entry', problemEntry);
app.use('/api/hardware-inventory', hardwareInventory);

module.exports = app;