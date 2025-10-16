const Assignment = require('../models/assignmentModel');
const Repair = require('../models/repairModel');
const Transfer = require('../models/transferModel');
const Hardware = require('../models/hardwareModel');
const StatusLog = require('../models/statusLogModel');

async function submitRepairReport(req, res) {
  try {
    const { assignment_id, work_details, parts_changed, repair_status } = req.body;
    // create repair report
    const reportId = await Repair.createReport({ assignment_id, work_details, parts_changed, repair_status });
    // set assignment status completed
    await Assignment.setStatus(assignment_id, 'Completed');

    // get transfer_id and hardware from assignment
    const assignment = await Assignment.findById(assignment_id);
    if (assignment && assignment.transfer_id) {
      await Transfer.updateStatus(assignment.transfer_id, 'Ready');
      const tr = await Transfer.findById(assignment.transfer_id);
      if (tr && tr.hardware_id) {
        await Hardware.updateStatus(tr.hardware_id, 'Ready');
        await StatusLog.log({ hardware_id: tr.hardware_id, status: 'Ready', changed_by: req.user.id, remarks: 'Repair completed by engineer' });
      }
    }

    res.json({ message: 'Repair report submitted', reportId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error submitting repair report' });
  }
}

module.exports = { submitRepairReport };
