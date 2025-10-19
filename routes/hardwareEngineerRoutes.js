const express = require('express');
const router = express.Router();
const engineerController = require('../controllers/hardwareEngineerController');

// All engineer routes
router.get('/engineers', engineerController.getAllEngineers);
router.get('/engineers/:id', engineerController.getEngineerById);
router.post('/engineers-add', engineerController.createEngineer);
router.put('/engineers/:id', engineerController.updateEngineer);
router.delete('/engineers/:id', engineerController.deleteEngineer);

module.exports = router;
