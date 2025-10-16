// D:\Hardware\hardware_backend\app.js

require('dotenv').config(); // <-- load env variables

const express = require('express');
const bodyParser = require('body-parser'); // Using body-parser as it was in your original snippet
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const session = require('express-session');




// --- Your Local Route/Middleware Imports ---
const logger = require('../hardware_backend/config/logger'); 
const assignmentRoute = require('./routes/assignmentRoutes');
const authRoutes = require('./routes/authRoutes');
const hardwareRoutes = require('./routes/hardwareRoutes');
const officeRoutes = require('./routes/officeRoutes');
const repairRoutes = require('./routes/repairRoutes');
const transferRoutes = require('./routes/transferRoutes');

const app = express();

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
app.use('/api', assignmentRoute);
app.use('/api', authRoutes);
app.use('/hardware/api', hardwareRoutes);
app.use('/office/api', officeRoutes);
app.use('/repair/api', repairRoutes);
app.use('/transfer/api', transferRoutes);


module.exports = app;