const engineerModel = require('../models/hardwareEngineerModel');

// Get all engineers
exports.getAllEngineers = async (req, res) => {
  try {
    const engineers = await engineerModel.getAllEngineers();
    res.status(200).json(engineers);
  } catch (err) {
    console.error("Error fetching engineers:", err);
    res.status(500).json({ message: "Error fetching engineers", error: err.message });
  }
};

// Get single engineer
exports.getEngineerById = async (req, res) => {
  try {
    const { id } = req.params;
    const engineer = await engineerModel.getEngineerById(id);

    if (engineer.length === 0) {
      return res.status(404).json({ message: "Engineer not found" });
    }

    res.status(200).json(engineer[0]);
  } catch (err) {
    console.error("Error fetching engineer:", err);
    res.status(500).json({ message: "Error fetching engineer", error: err.message });
  }
};

// Create engineer
// exports.createEngineer = async (req, res) => {
//   try {
//     const result = await engineerModel.createEngineer(req.body);
//     res.status(201).json({ message: "Engineer created successfully", engineer_id: result.insertId });
//   } catch (err) {
//     console.error("Error creating engineer:", err);
//     res.status(500).json({ message: "Error creating engineer", error: err.message });
//   }
// };

exports.createEngineerWithUser = async (req, res) => {
  try {
    const result = await engineerModel.createEngineerWithUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating engineer:", error);
    res.status(500).json({ message: "Failed to create engineer and user" });
  }
};

// Update engineer
exports.updateEngineer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await engineerModel.updateEngineer(id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Engineer not found" });
    }

    res.status(200).json({ message: "Engineer updated successfully" });
  } catch (err) {
    console.error("Error updating engineer:", err);
    res.status(500).json({ message: "Error updating engineer", error: err.message });
  }
};

// Delete engineer
exports.deleteEngineer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await engineerModel.deleteEngineer(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Engineer not found" });
    }

    res.status(200).json({ message: "Engineer deleted successfully" });
  } catch (err) {
    console.error("Error deleting engineer:", err);
    res.status(500).json({ message: "Error deleting engineer", error: err.message });
  }
};
