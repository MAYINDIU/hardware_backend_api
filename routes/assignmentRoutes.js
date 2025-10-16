const express = require('express');
const router = express.Router();
const { assignEngineer } = require('../controllers/assignmentController');
const { authMiddleware, roleGuard } = require('../middlewares/auth');

// only admin assigns
router.post('/assign', authMiddleware, roleGuard(['admin']), assignEngineer);

module.exports = router;
