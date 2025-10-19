const branchModel = require('../models/branchModel');

// Get all branches
exports.getAllBranches = async (req, res) => {
  try {
    const branches = await branchModel.getAllBranches();
    res.status(200).json(branches);
  } catch (err) {
    console.error("Error fetching branches:", err);
    res.status(500).json({ message: "Error fetching branches", error: err.message });
  }
};

// Get branch by ID
exports.getBranchById = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await branchModel.getBranchById(id);

    if (branch.length === 0) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json(branch[0]);
  } catch (err) {
    console.error("Error fetching branch:", err);
    res.status(500).json({ message: "Error fetching branch", error: err.message });
  }
};

// Create new branch
exports.createBranch = async (req, res) => {
  try {
    const result = await branchModel.createBranch(req.body);
    res.status(201).json({ message: "Branch created successfully", branch_id: result.insertId });
  } catch (err) {
    console.error("Error creating branch:", err);
    res.status(500).json({ message: "Error creating branch", error: err.message });
  }
};

// Update branch
exports.updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await branchModel.updateBranch(id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json({ message: "Branch updated successfully" });
  } catch (err) {
    console.error("Error updating branch:", err);
    res.status(500).json({ message: "Error updating branch", error: err.message });
  }
};

// Delete branch
exports.deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await branchModel.deleteBranch(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json({ message: "Branch deleted successfully" });
  } catch (err) {
    console.error("Error deleting branch:", err);
    res.status(500).json({ message: "Error deleting branch", error: err.message });
  }
};
