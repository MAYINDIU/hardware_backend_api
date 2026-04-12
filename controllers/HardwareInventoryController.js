const { getRequisitionsFromDb,getHardwareWokredinfo,getHardwareWorkAllinfo,insertHardwareInfo,getItemsByGroup,
    getAllBrands,getModelsByItem,getProblemsByItem,getITEmployees,getAllSections,getBranchZoneInfo,getHardwareById,getStatusList,updateHardwareInfo
 } = require('../models/HardwareInventoryModel');



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
            mobile_no:          clean(body.mobile_no)
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
            mobile_no:          clean(body.mobile_no)
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