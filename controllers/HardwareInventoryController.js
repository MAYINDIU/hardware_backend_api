const {getHardwareByEngineer,deleteHardwareById,updateDeliveryInfo,getCompletedHardware,getEngineerStatusCounts,finalizeTask,updateToWorking, getEngIdWiseWorklist,getHardwareAssignedAllinfo,getRequisitionsFromDb,getHardwareWokredinfo,getHardwareWorkAllinfo,insertHardwareInfo,getItemsByGroup,
    getAllBrands,getModelsByItem,getProblemsByItem,getITEmployees,getAllSections,getBranchZoneInfo,getHardwareById,getStatusList,updateHardwareInfo,getStatusCounts
 } = require('../models/HardwareInventoryModel');



 exports.getEngineerWork = async (req, res) => {
    try {
        const { engId } = req.params; // Expecting /api/hardware/engineer/6669

        if (!engId) {
            return res.status(400).json({ error: "Engineer ID is required" });
        }

        const data = await getHardwareByEngineer(engId);
        
        res.status(200).json({
            success: true,
            count: data.length,
            data: data
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


 exports.getCompletedList = async (req, res) => {
    try {
        // Extract dates from query parameters: /api/hardware?start=2024-01-01&end=2024-01-31
        const { start, end } = req.query;

        if (!start || !end) {
            return res.status(400).json({ error: "Please provide both start and end dates." });
        }

        const data = await getCompletedHardware(start, end);
        
        res.status(200).json({
            success: true,
            count: data.length,
            data: data
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

 exports.getMyHardwareStats = async (req, res) => {
    const { engId } = req.params; // Expecting ID in the URL

    if (!engId) {
        return res.status(400).json({ success: false, message: "Engineer ID is required" });
    }

    try {
        const stats = await getEngineerStatusCounts(engId);
        
        res.status(200).json({
            success: true,
            engineerId: engId,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving personal stats",
            error: error.message
        });
    }
};

exports.getHardwareStats = async (req, res) => {
    try {
        const stats = await getStatusCounts();
        
        res.status(200).json({
            success: true,
            data: stats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Controller Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch hardware statistics",
            error: error.message
        });
    }
};

exports.getAllStatuses = async (req, res) => {
    try {
        const statuses = await getStatusList();

        res.status(200).json({
            status: "Success",
            count: statuses.length,
            data: statuses
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        });
    }
};

exports.getDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUser = req.query.user_name; // Simulating :global.user_name
        const currentEmpId = req.query.emp_id;   // Simulating :control.emp_id

        const data = await getHardwareById(id);

        if (!data) {
            return res.status(404).json({ status: "Error", message: "Record not found" });
        }

        // Logic for Edit Button Permission
        let canEdit = false;
        if (currentUser === 'ADMIN' || data.RECEIVED_BY === currentEmpId) {
            canEdit = true;
        }

        res.status(200).json({
            status: "Success",
            canEdit: canEdit, // Tells frontend to enable/disable edit button
            data: data
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
};


exports.getBranches = async (req, res) => {
    try {
        const branches = await getBranchZoneInfo();

        res.status(200).json({
            status: "Success",
            count: branches.length,
            data: branches
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message
        });
    }
};



exports.getSectionsList = async (req, res) => {
    try {
        const sections = await getAllSections();

        res.status(200).json({
            status: "Success",
            count: sections.length,
            data: sections
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message
        });
    }
};

exports.getITStaffList = async (req, res) => {
    try {
        const employees = await getITEmployees();

        res.status(200).json({
            status: "Success",
            count: employees.length,
            data: employees
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message
        });
    }
};
exports.getItemProblems = async (req, res) => {
    try {
        const { itemCode } = req.params;

        if (!itemCode) {
            return res.status(400).json({
                status: "Error",
                message: "Item Code is required to fetch problems"
            });
        }

        const problems = await getProblemsByItem(itemCode);

        res.status(200).json({
            status: "Success",
            count: problems.length,
            data: problems
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message
        });
    }
};

exports.createHardwareRecord = async (req, res) => {
    try {
        const body = req.body;

        // Sanitizer: Converts empty strings "" to null
        // This prevents ORA-01722 on numeric columns
        const clean = (val) => (val === "" || val === undefined) ? null : val;

        const bindData = {
            inv_no:             clean(body.inv_no),
            item_code:          clean(body.item_code),
            model:              clean(body.model),
            material_brand_id:  clean(body.material_brand_id),
            job_description:    clean(body.job_description),
            remarks:            clean(body.remarks),
            section:            clean(body.section),
            b_code:             clean(body.b_code),
            z_code:             clean(body.z_code),
            project:            clean(body.project),
            received_name:      clean(body.received_name),
            received_by:        clean(body.received_by),
            received_date:      clean(body.received_date),
            delivered_name:     clean(body.delivered_name),
            delivered_by:       clean(body.delivered_by),
            delivered_date:     clean(body.delivered_date),
            status:             clean(body.status),
            requisition_no:     clean(body.requisition_no),
            insert_by:          clean(body.user_name),
            hardware_date:      clean(body.hardware_date),
            assist_by:          clean(body.assist_by),
            assist_name:        clean(body.assist_name),
            emp_id:             clean(body.emp_id),
            serial_no:          clean(body.serial_no),
            mobile_no:          clean(body.mobile_no),

            // --- New Fields Added Below ---
            eng_id:             clean(body.eng_id),
            eng_name:           clean(body.eng_name)

        };

        const result = await insertHardwareInfo(bindData);
        
        res.status(201).json({
            status: "Success",
            message: "Hardware record saved successfully",
            affectedRows: result.rowsAffected
        });

    } catch (error) {
        res.status(500).json({
            status: "Error",
            code: error.errorNum || "INTERNAL_ERROR",
            message: error.message,
            details: "Ensure numeric fields don't contain letters and dates follow YYYY-MM-DD"
        });
    }
};


exports.updateHardware = async (req, res) => {
    try {
        const body = req.body;

        // 1. Critical: Check if hardware_id exists
        if (!body.hardware_id) {
            return res.status(400).json({ status: "Error", message: "Hardware ID is required." });
        }

        // 2. Professional Sanitizers
        const clean = (val) => (val === "" || val === undefined || val === null) ? null : String(val).trim();
        
        // Use this for columns that ARE numbers in Oracle (like material_brand_id)
        const toNum = (val) => {
            const trimmed = clean(val);
            if (trimmed === null) return null;
            const parsed = Number(trimmed);
            return isNaN(parsed) ? null : parsed; // Returns null if it's not a valid number to prevent ORA-01722
        };

        const bindData = {
            // Trim hardware_id specifically for the WHERE clause
            hardware_id:        clean(body.hardware_id), 
            
            inv_no:             clean(body.inv_no),
            item_code:          clean(body.item_code),
            model:              clean(body.model),
            material_brand_id:  toNum(body.material_brand_id), 
            job_description:    clean(body.job_description),
            remarks:            clean(body.remarks),
            section:            clean(body.section),
            b_code:             clean(body.b_code),
            z_code:             clean(body.z_code),
            project:            clean(body.project),
            received_name:      clean(body.received_name),
            received_by:        clean(body.received_by),
            received_date:      clean(body.received_date),
            delivered_name:     clean(body.delivered_name),
            delivered_by:       clean(body.delivered_by),
            delivered_date:     clean(body.delivered_date),
            status:             clean(body.status_name), 
            requisition_no:     clean(body.requisition_no),
            update_by:          clean(body.user_name) || 'SYSTEM',
            hardware_date:      clean(body.hardware_date),
            assist_by:          clean(body.assist_by),
            assist_name:        clean(body.assist_name),
            serial_no:          clean(body.serial_no),
            mobile_no:          clean(body.mobile_no),


            // --- New Engineering Fields Added Here ---
            eng_id:             clean(body.eng_id),
            eng_name:           clean(body.eng_name),
            work_status:        clean(body.work_status),
            eng_comments:       clean(body.eng_comments)
        };

        const result = await updateHardwareInfo(bindData);

        if (result.rowsAffected > 0) {
            return res.status(200).json({ 
                status: "Success", 
                message: `Hardware [${bindData.hardware_id}] updated successfully.` 
            });
        } else {
            return res.status(404).json({ status: "Error", message: "Record not found in database." });
        }

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ status: "Error", code: error.errorNum, message: error.message });
    }
};


exports.getAllItems = async (req, res) => {
    try {
        const items = await getItemsByGroup();

        if (items.length === 0) {
            return res.status(404).json({
                status: "Success",
                message: "No items found for this group",
                data: []
            });
        }

        res.status(200).json({
            status: "Success",
            count: items.length,
            data: items
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message
        });
    }
};



exports.getBrands = async (req, res) => {
    try {
        const brands = await getAllBrands();

        res.status(200).json({
            status: "Success",
            count: brands.length,
            data: brands
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message
        });
    }
};

exports.getItemModels = async (req, res) => {
    try {
        const { itemCode } = req.params; // Expecting /api/item-models/01800

        if (!itemCode) {
            return res.status(400).json({
                status: "Error",
                message: "Item Code is required"
            });
        }

        const models = await getModelsByItem(itemCode);

        res.status(200).json({
            status: "Success",
            count: models.length,
            data: models
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message
        });
    }
};






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


exports.getWorkassignedList = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Call model with sanitized filters
        const rows = await getHardwareAssignedAllinfo({
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


exports.getEngineerWorklist = async (req, res) => {
    try {
        // Extract eng_id from URL parameters (e.g., /worklist/6977)
        const engId = req.params.engId;

        if (!engId) {
            return res.status(400).json({ 
                status: "Error", 
                message: "Engineer ID is required to fetch the worklist." 
            });
        }

        // Call the Model function we created previously
        const worklist = await getEngIdWiseWorklist(engId);

        if (!worklist || worklist.length === 0) {
            return res.status(200).json({ 
                status: "Success", 
                message: "No assigned work found for this Engineer.",
                count: 0,
                data: [] 
            });
        }

        res.status(200).json({
            status: "Success",
            count: worklist.length,
            data: worklist
        });

    } catch (error) {
        console.error("Controller Error (getEngineerWorklist):", error);
        res.status(500).json({ 
            status: "Error", 
            message: "Failed to retrieve engineer worklist.",
            details: error.message 
        });
    }
};



exports.startWork = async (req, res) => {
    try {
        const { hardware_id } = req.body;

        // Validation
        if (!hardware_id) {
            return res.status(400).json({ 
                status: "Error", 
                message: "Hardware ID is required to update status." 
            });
        }

        const data = {
            hardware_id: hardware_id,
            work_status: "WORKING" 
        };

        const result = await updateToWorking(data);

        if (result.rowsAffected && result.rowsAffected > 0) {
            return res.status(200).json({
                status: "Success",
                message: `Hardware #${hardware_id} marked as WORKING.`
            });
        } else {
            return res.status(404).json({ 
                status: "Error", 
                message: "Record not found in Oracle database." 
            });
        }
    } catch (error) {
        console.error("Start Work Controller Error:", error);
        res.status(500).json({ status: "Error", message: error.message });
    }
};


exports.completeHardwareTask = async (req, res) => {
    try {
        const { 
            hardware_id, 
            assist_by, 
            assist_name, 
            work_status, 
            eng_comments 
        } = req.body;

        if (!hardware_id) {
            return res.status(400).json({ status: "Error", message: "Hardware ID is required." });
        }

        const updateData = {
            hardware_id,
            assist_by,
            assist_name,
            work_status: work_status || 'COMPLETED', // Default to COMPLETED if not sent
            eng_comments
        };

        const result = await finalizeTask(updateData);

        if (result.rowsAffected && result.rowsAffected > 0) {
            res.status(200).json({
                status: "Success",
                message: `Hardware #${hardware_id} has been updated and closed.`
            });
        } else {
            res.status(404).json({ status: "Error", message: "Record not found." });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: "Error", message: error.message });
    }
};

exports.logDelivery = async (req, res) => {
    const { 
        hardware_id, 
        delivered_by, 
        delivered_name, 
        delivered_date 
    } = req.body;

    // 1. Validate mandatory fields
    if (!hardware_id || !delivered_by || !delivered_name) {
        return res.status(400).json({ 
            success: false, 
            message: "Missing required fields: hardware_id, delivered_by, and delivered_name are mandatory." 
        });
    }

    try {
        // 2. Call the Model function
        const rowsAffected = await updateDeliveryInfo({
            hardware_id,
            delivered_by,
            delivered_name,
            delivered_date // Model defaults to current date if this is null
        });

        // 3. Handle the result
        if (rowsAffected > 0) {
            return res.status(200).json({ 
                success: true, 
                message: "Delivery details logged successfully.",
                data: {
                    id: hardware_id,
                    handled_by: delivered_by,
                    timestamp: delivered_date || new Date().toISOString()
                }
            });
        } else {
            return res.status(404).json({ 
                success: false, 
                message: `No record found with Hardware ID: ${hardware_id}` 
            });
        }

    } catch (error) {
        console.error("Delivery Controller Error:", error.message);
        
        return res.status(500).json({ 
            success: false, 
            message: "An internal server error occurred while updating delivery info.",
            error: error.message 
        });
    }
};


exports.deleteHardware = async (req, res) => {
    try {
        const { id } = req.params; // Grabs the ID from the URL path

        if (!id) {
            return res.status(400).json({ error: "Hardware ID is required." });
        }

        const rowsDeleted = await deleteHardwareById(id);
        
        if (rowsDeleted === 0) {
            return res.status(404).json({ 
                success: false, 
                message: `No hardware found with ID: ${id}` 
            });
        }

        res.status(200).json({
            success: true,
            message: `Hardware ${id} deleted successfully.`
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};