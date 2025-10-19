const assignmentModel = require('../models/engineerAssignmentModel');

// Get all assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await assignmentModel.getAllAssignments();
    res.status(200).json(assignments);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    res.status(500).json({ message: "Error fetching assignments", error: err.message });
  }
};

// Get assignment by ID
exports.getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await assignmentModel.getAssignmentById(id);

    if (assignment.length === 0) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json(assignment[0]);
  } catch (err) {
    console.error("Error fetching assignment:", err);
    res.status(500).json({ message: "Error fetching assignment", error: err.message });
  }
};

// Create assignment
exports.createAssignment = async (req, res) => {
  try {
    const result = await assignmentModel.createAssignment(req.body);
    res.status(201).json({ message: "Assignment created successfully", assignment_id: result.insertId });
  } catch (err) {
    console.error("Error creating assignment:", err);
    res.status(500).json({ message: "Error creating assignment", error: err.message });
  }
};

// Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await assignmentModel.updateAssignment(id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({ message: "Assignment updated successfully" });
  } catch (err) {
    console.error("Error updating assignment:", err);
    res.status(500).json({ message: "Error updating assignment", error: err.message });
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await assignmentModel.deleteAssignment(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (err) {
    console.error("Error deleting assignment:", err);
    res.status(500).json({ message: "Error deleting assignment", error: err.message });
  }
};
