const hardwareRequestModel = require('../models/hardwareRequestModel');



exports.getAdminStats = async (req, res) => {
    try {
        const stats = await hardwareRequestModel.getAdminDashboardCounts();
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error("Admin Stats Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



exports.getEngineerStats = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Engineer ID is required" });
        }

        const stats = await hardwareRequestModel.getDashboardCountsByEng(id);
        res.status(200).json(stats);
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get total Application list
exports.getAllTotal= async (req, res) => {
  try {
    const requests = await hardwareRequestModel.getDashboardCounts();
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching hardware total:", err);
    res.status(500).json({ message: "Error fetching total", error: err.message });
  }
};


exports.getUserDashboardCounts = async (req, res) => {
  try {
    const { userId } = req.params; // or req.user.id if using auth middleware

    const counts = await hardwareRequestModel.getUserStatusCounts(userId);

    res.status(200).json({
      message: "User dashboard counts fetched successfully",
      data: counts
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Error fetching dashboard counts", error: err.message });
  }
};






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

    // ✅ Return as array of objects, even if only one item
    res.status(200).json(request);
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


// Update hardware Enginner comments
exports.updateEngineerComment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await hardwareRequestModel.updateEngineerComments(id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Hardware request not found" });
    }

    res.status(200).json({ message: "Hardware comments updated successfully" });
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
