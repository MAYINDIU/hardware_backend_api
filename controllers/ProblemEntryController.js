const problemModel = require('../models/ProblemEntryModel');

exports.createEntry = async (req, res) => {
  try {
    const result = await problemModel.createProblemEntry(req.body);
    res.status(201).json({ message: "Entry created successfully", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEntries = async (req, res) => {
  try {
    const entries = await problemModel.getAllProblemEntries();
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEntryById = async (req, res) => {
  try {
    const entry = await problemModel.getProblemEntryById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Handle Edit/Update
exports.updateEntry = async (req, res) => {
  try {
    const result = await problemModel.updateProblemEntry(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.status(200).json({ message: "Entry updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handle Delete
exports.deleteEntry = async (req, res) => {
  try {
    const result = await problemModel.deleteProblemEntry(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};