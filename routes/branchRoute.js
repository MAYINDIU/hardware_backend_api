const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');

// All branch routes
router.get('/all-branches', branchController.getAllBranches);
router.get('/branches/:id', branchController.getBranchById);
router.post('/create-branches', branchController.createBranch);
router.put('/branches/:id', branchController.updateBranch);
router.delete('/branches/:id', branchController.deleteBranch);

module.exports = router;
