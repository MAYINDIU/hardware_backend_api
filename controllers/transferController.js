const Transfer = require('../models/transferModel');
const Hardware = require('../models/hardwareModel');
const StatusLog = require('../models/statusLogModel');

/**
 * Create a new transfer request
 */
async function createTransfer(req, res) {
    try {
        const { hardware_item_id, from_office_id, reason, problem_description } = req.body;
        const created_by = req.user.id;

        const insertId = await Transfer.create({ hardware_item_id, from_office_id, reason, problem_description, created_by });

        // Update hardware status
        await Hardware.updateStatus(hardware_item_id, 'Sent to Head Office');

        // Log status
        await StatusLog.log({ hardware_item_id, status: 'Sent to Head Office', changed_by: created_by, remarks: reason });

        res.json({ message: 'Transfer request created', id: insertId });
    } catch (err) {
        if (err.message.includes('Validation Error')) {
            return res.status(400).json({ message: err.message });
        }
        console.error(err);
        res.status(500).json({ message: 'Error creating transfer request' });
    }
}

/**
 * List transfers with optional filters
 */
async function listTransfers(req, res) {
    try {
        const filters = {};
        if (req.query.status) filters.status = req.query.status;
        if (req.query.from_office_id) filters.from_office_id = req.query.from_office_id;

        const rows = await Transfer.list(filters);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error listing transfers' });
    }
}

/**
 * Get a single transfer by ID
 */
async function getTransfer(req, res) {
    try {
        const id = req.params.id;
        const row = await Transfer.findById(id);
        if (!row) return res.status(404).json({ message: 'Not found' });
        res.json(row);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching transfer' });
    }
}

/**
 * Update transfer status
 */
async function updateTransferStatus(req, res) {
    try {
        const id = req.params.id;
        const { status, remarks } = req.body;

        // Fetch transfer to get hardware_item_id
        const transfer = await Transfer.findById(id);
        if (!transfer) return res.status(404).json({ message: 'Transfer not found' });

        // Update transfer status
        await Transfer.updateStatus(id, status);

        // Update hardware status
        await Hardware.updateStatus(transfer.hardware_item_id, status);

        // Log status change
        await StatusLog.log({
            hardware_item_id: transfer.hardware_item_id,
            status,
            changed_by: req.user.id,
            remarks: remarks || `Status updated to ${status}`
        });

        res.json({ message: 'Transfer status updated', id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating transfer status' });
    }
}

module.exports = {
    createTransfer,
    listTransfers,
    getTransfer,
    updateTransferStatus
};

