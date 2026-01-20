const express = require('express');
const router = express.Router();
const hardwareRequestController = require('../controllers/hardwareRequestController');

// All hardware request routes
router.get('/hardware-requests-list', hardwareRequestController.getAllRequests);
router.get('/hardware-requests/:id', hardwareRequestController.getRequestById);
router.post('/hardware-requests', hardwareRequestController.createRequest);
router.put('/hardware-requests-update/:id', hardwareRequestController.updateRequest);
router.delete('/hardware-requests/:id', hardwareRequestController.deleteRequest);
router.get('/total-summary', hardwareRequestController.getAllTotal);
router.get("/dashboard-counts/:userId", hardwareRequestController.getUserDashboardCounts);

module.exports = router;
