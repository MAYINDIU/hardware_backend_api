const hardwareModel = require('../models/hardwareModel');

/**
 * Handles POST /hardware - Creates a new hardware item.
 */
const createHardwareItem = async (req, res) => {
    try {
        const itemData = req.body;

        // Basic validation for required fields
        if (!itemData.asset_tag || !itemData.category || !itemData.serial_number || !itemData.current_office_id) {
            return res.status(400).json({ message: 'Missing required fields: asset_tag, category, serial_number, and current_office_id.' });
        }

        const newId = await hardwareModel.create(itemData);
        
        res.status(201).json({ 
            message: 'Hardware item created successfully.', 
            id: newId,
            ...itemData 
        });
    } catch (error) {
        console.error('Controller Error - Creating Hardware Item:', error);
        res.status(500).json({ message: 'Failed to create hardware item.', error: error.message });
    }
};

/**
 * Handles GET /hardware/:id - Retrieves a single hardware item by ID.
 */
const getHardwareItem = async (req, res) => {
    try {
        const id = req.params.id;
        const item = await hardwareModel.findById(id);

        if (!item) {
            return res.status(404).json({ message: `Hardware item with ID ${id} not found.` });
        }
        
        res.json(item);
    } catch (error) {
        console.error('Controller Error - Retrieving Hardware Item:', error);
        res.status(500).json({ message: 'Failed to retrieve hardware item.', error: error.message });
    }
};

// Placeholder for updateStatus route handler (only the model function was provided)
const updateHardwareStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status field is required for update.' });
        }

        await hardwareModel.updateStatus(id, status);
        
        res.json({ message: `Hardware item ${id} status updated to: ${status}` });
    } catch (error) {
        console.error('Controller Error - Updating Hardware Status:', error);
        res.status(500).json({ message: 'Failed to update hardware item status.', error: error.message });
    }
};


module.exports = { createHardwareItem, getHardwareItem, updateHardwareStatus };
