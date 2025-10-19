const hardwareRequestModel = require('../models/hardwareRequestModel');

// Get all hardware requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await hardwareRequestModel.getAllRequests();
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching hardware requests:", err);
    res.status(500).json({ message: "Error fetching requests", error: err.message });
  }
};

// Get hardware request by ID
exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await hardwareRequestModel.getRequestById(id);

    if (request.length === 0) {
      return res.status(404).json({ message: "Hardware request not found" });
    }

    res.status(200).json(request[0]);
  } catch (err) {
    console.error("Error fetching hardware request:", err);
    res.status(500).json({ message: "Error fetching request", error: err.message });
  }
};

// Create new hardware request
exports.createRequest = async (req, res) => {
  try {
    const result = await hardwareRequestModel.createRequest(req.body);
    res.status(201).json({
      message: "Hardware request created successfully",
      request_id: result.insertId,
    });
  } catch (err) {
    console.error("Error creating hardware request:", err);
    res.status(500).json({ message: "Error creating request", error: err.message });
  }
};

// Update hardware request
exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await hardwareRequestModel.updateRequest(id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Hardware request not found" });
    }

    res.status(200).json({ message: "Hardware request updated successfully" });
  } catch (err) {
    console.error("Error updating hardware request:", err);
    res.status(500).json({ message: "Error updating request", error: err.message });
  }
};

// Delete hardware request
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await hardwareRequestModel.deleteRequest(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Hardware request not found" });
    }

    res.status(200).json({ message: "Hardware request deleted successfully" });
  } catch (err) {
    console.error("Error deleting hardware request:", err);
    res.status(500).json({ message: "Error deleting request", error: err.message });
  }
};
