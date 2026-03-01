const { getRequisitionsFromDb,getHardwareWokredinfo,getHardwareWorkAllinfo } = require('../models/HardwareInventoryModel');

exports.getRequisitions = async (req, res) => {
    try {
  const { startDate, endDate, empId } = req.query;


        // Validation
        if (!startDate || !endDate) {
            return res.status(400).json({ 
                success: false,
                message: "Missing params. Please provide startDate and endDate (DD/MM/YYYY)" 
            });
        }

        const data = await getRequisitionsFromDb({ startDate, endDate, empId });
        
        if (data.length === 0) {
            return res.status(404).json({
                success: true,
                message: "No records found for the given criteria",
                data: []
            });
        }

        res.status(200).json({
            success: true,
            count: data.length,
            data: data
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


exports.getHardwareInfo = async (req, res) => {
    try {
        const filters = {
            receivedBy: req.query.receivedBy,
            startDate:  req.query.startDate,
            endDate:    req.query.endDate
        };

        if (!filters.receivedBy) {
            return res.status(400).json({ error: "RECEIVED_BY (ID) is required" });
        }

        // Fetch data from your model
        const data = await getHardwareWokredinfo(filters);

        // Send back both the array and the count
        res.status(200).json({
            success: true,
            totalItems: data.length, // Total count of rows
            data: data               // The actual database rows
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

exports.getWorkReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Call model with sanitized filters
        const rows = await getHardwareWorkAllinfo({
            startDate,
            endDate
        });

        // Professional response structure
        res.status(200).json({
            success: true,
            count: rows.length,
            reportGeneratedAt: new Date().toISOString(),
            data: rows
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch hardware report.",
            error: err.message 
        });
    }
};