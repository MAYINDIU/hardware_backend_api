const officeModel = require('../models/officeModel');

/**
 * Handles GET request to retrieve all offices.
 */
const listOffices = async (req, res) => {
    // Added logging for req.body as requested (officeData is set to req.body)
    const officeData = req.body;
    console.log('GET /offices Request Body (Expected to be empty):', officeData);
    
    try {
        const offices = await officeModel.getAllOffices();
        res.json(offices);
    } catch (error) {
        console.error('Controller Error - Listing Offices:', error.message);
        // Send a generic 500 status on database error
        res.status(500).json({ message: 'Failed to retrieve offices.', error: error.message });
    }
};

/**
 * Handles POST request to create a new office.
 */
const addOffice = async (req, res) => {
    try {
        const officeData = req.body;
        
        // Basic input validation: check for required fields
        if (!officeData.office_name || !officeData.email) {
            return res.status(400).json({ message: 'Office name and email are required fields.' });
        }

        const newId = await officeModel.createOffice(officeData);
        
        // Respond with 201 Created status
        res.status(201).json({ 
            message: 'Office created successfully.', 
            id: newId,
            ...officeData // Echo back the submitted data plus the new ID
        });
    } catch (error) {
        console.error('Controller Error - Adding Office:', error.message);
        // Send a 500 status for database errors (e.g., connection issues, unique constraints)
        res.status(500).json({ message: 'Failed to create office.', error: error.message });
    }
};

module.exports = { listOffices, addOffice };
