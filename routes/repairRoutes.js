const express = require('express');
const router = express.Router();
const { submitRepairReport } = require('../controllers/repairController');
const { authMiddleware, roleGuard } = require('../middlewares/auth');

// engineer submits repair report
router.post('/submit', authMiddleware, roleGuard(['engineer']), submitRepairReport);

module.exports = router;
