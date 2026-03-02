
const Stock = require('../models/HardwareStockModel');

exports.addStock = async (req, res) => {
    try {
        const { category, brand, model_no, qty,user_id } = req.body;

        if (!category || !brand || !model_no || !qty) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const result = await Stock.create({
            category,
            brand,
            model_no,
            qty,
            user_id
        });

        res.status(201).json({
            success: true,
            insertId: result.insertId
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Database error",
            error: err.message
        });
    }
};



// 3. View Inventory
exports.listInventory = async (req, res) => {
    try {
        const data = await Stock.getInventory();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
};
// 4. View Assign List
exports.AllAssignlist = async (req, res) => {
    try {
        const data = await Stock.getAssignlist();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
};




exports.assignToEmployee = async (req, res) => {
  try {
    const { item_id, emp_id, emp_name, qty_assigned,user_id } = req.body;

    if (!item_id || !emp_id || !emp_name) {
      return res.status(400).json({
        success: false,
        message: "item_id, emp_id and emp_name are required"
      });
    }

    const qty = qty_assigned ? Number(qty_assigned) : 1;

    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({
        success: false,
        message: "qty_assigned must be positive number"
      });
    }

    await Stock.assignToEmployee({
      item_id,
      emp_id,
      emp_name,
      qty_assigned: qty,
      user_id:user_id
    });

    res.json({
      success: true,
      message: "Hardware assigned successfully"
    });

  } catch (err) {

    const status = err.sqlState === "45000" ? 400 : 500;

    res.status(status).json({
      success: false,
      message: err.message
    });
  }
};

exports.updateEmployeeAssign = async (req, res) => {
  try {
    const { id } = req.params;
    const { item_id, emp_id,user_id, emp_name, qty_assigned, tag, status } = req.body;

    // Basic validation
    if (!id) {
      return res.status(400).json({ success: false, message: "assign_id is required" });
    }

    if (!item_id || !emp_id || !emp_name || !qty_assigned) {
      return res.status(400).json({
        success: false,
        message: "item_id, emp_id, emp_name, qty_assigned are required"
      });
    }

    if (!status || !["Active", "Returned", "Damaged"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status must be Active / Returned / Damaged"
      });
    }

    const result = await Stock.updateEmployeeAssign(id, {
      item_id,
      emp_id,
      user_id,
      emp_name,
      qty_assigned,
      tag,
      status
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    res.json({
      success: true,
      message: "Assignment updated successfully",
      affectedRows: result.affectedRows
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};