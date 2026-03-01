const express = require('express');
const router = express.Router();
const hardwareInventoryController = require('../controllers/HardwareInventoryController');

router.get('/hardware-inventory-details', hardwareInventoryController.getRequisitions);
router.get('/hardware-info', hardwareInventoryController.getHardwareInfo);
router.get("/work-report", hardwareInventoryController.getWorkReport);
module.exports = router;
