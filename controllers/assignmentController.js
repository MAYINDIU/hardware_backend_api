const Assignment = require('../models/assignmentModel');
const Transfer = require('../models/transferModel');
const Hardware = require('../models/hardwareModel');
const StatusLog = require('../models/statusLogModel');

async function assignEngineer(req, res) {
  try {
    const { transfer_id, engineer_id } = req.body;
    const assigned_by = req.user.id;
    // create assignment
    const id = await Assignment.create({ transfer_id, engineer_id, assigned_by });
    // update transfer status
    await Transfer.updateStatus(transfer_id, 'Assigned');
    // update hardware status -> find transfer -> hardware_id
    const tr = await Transfer.findById(transfer_id);
    if (tr && tr.hardware_id) {
      await Hardware.updateStatus(tr.hardware_id, 'Assigned');
      await StatusLog.log({ hardware_id: tr.hardware_id, status: 'Assigned', changed_by: assigned_by, remarks: `Assigned to engineer ${engineer_id}` });
    }
    res.json({ message: 'Engineer assigned', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error assigning engineer' });
  }
}

module.exports = { assignEngineer };
