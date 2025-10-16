const express = require('express');
const router = express.Router();
const hardwareController = require('../controllers/hardwareController');
// Assuming you have these middleware functions defined elsewhere:
// const { authMiddleware, roleGuard } = require('../middlewares/auth'); 


// GET /api/hardware/:id - Get a single item
router.get('/hardware/:id', hardwareController.getHardwareItem);

// POST /api/hardware - Create a new item (Requires Admin role in a secured app)
// Leaving this open for now, similar to your /offices route
router.post('/hardware-item-add', hardwareController.createHardwareItem);

// PUT /api/hardware/:id/status - Update an item's status
// This should definitely be secured in a production environment
router.put('/hardware/:id/status', hardwareController.updateHardwareStatus);


module.exports = router;
