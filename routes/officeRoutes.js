const express = require('express');
const router = express.Router();
const { listOffices, addOffice } = require('../controllers/officeController');
// Note: authMiddleware and roleGuard are no longer used for the /offices POST route,
// but they might be needed for other secured routes in your application.

router.get('/officeslist', listOffices);

// Removed authMiddleware and roleGuard(['admin']) to make this an open route
router.post('/offices', addOffice);

module.exports = router;
