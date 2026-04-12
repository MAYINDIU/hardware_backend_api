const express = require('express');
const router = express.Router();
const hardwareInventoryController = require('../controllers/HardwareInventoryController');



// Route to handle the insert
router.post('/add-hardware', hardwareInventoryController.createHardwareRecord);
router.post('/update-hardware', hardwareInventoryController.updateHardware);


router.get('/items-list', hardwareInventoryController.getAllItems);

router.get('/brands-list', hardwareInventoryController.getBrands);
router.get('/models-list/:itemCode', hardwareInventoryController.getItemModels);
// GET /api/item-problems/01800
router.get('/problem-list/:itemCode', hardwareInventoryController.getItemProblems);
router.get('/it-staff', hardwareInventoryController.getITStaffList);

router.get('/section-list', hardwareInventoryController.getSectionsList);

router.get('/branches-info', hardwareInventoryController.getBranches);

// GET /api/hardware/details/00001?user_name=ADMIN&emp_id=101
router.get('/hardware-details/:id', hardwareInventoryController.getDetails);

// GET /api/status/static-list
router.get('/status-list', hardwareInventoryController.getAllStatuses);

router.get('/hardware-inventory-details', hardwareInventoryController.getRequisitions);
router.get('/hardware-info', hardwareInventoryController.getHardwareInfo);
router.get("/work-report", hardwareInventoryController.getWorkReport);
module.exports = router;
