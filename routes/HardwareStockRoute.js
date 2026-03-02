const express = require('express');
const router = express.Router();
const stockController = require('../controllers/HardwareStockController');

// GET: http://localhost:3000/api/stock (View all stock)
router.get('/stock-history', stockController.listInventory);

router.get('/all-assign-list', stockController.AllAssignlist);


// POST: http://localhost:3000/api/stock/add (Entry when you buy hardware)
router.post('/add-stock', stockController.addStock);

// POST: http://localhost:3000/api/stock/assign (Entry when you give to employee)
router.post("/assign-to-employee", stockController.assignToEmployee);


router.put("/update-assign/:id", stockController.updateEmployeeAssign);
module.exports = router;