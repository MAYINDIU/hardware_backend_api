const express = require('express');
const router = express.Router();
const hardwareEntryController = require('../controllers/ProblemEntryController');

// POST: Create a new problem entry
router.post('/problem-entry', hardwareEntryController.createEntry);

// GET: Retrieve all problem entries
router.get('/all-problems', hardwareEntryController.getEntries);

// GET: Retrieve a specific entry by ID
router.get('/problem-entry/:id', hardwareEntryController.getEntryById);



// NEW: Edit/Update Route
router.put('/edit-entry/:id', hardwareEntryController.updateEntry);

// NEW: Delete Route
router.delete('/delete-entry/:id', hardwareEntryController.deleteEntry);

module.exports = router;