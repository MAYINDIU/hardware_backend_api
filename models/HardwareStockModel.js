const { pool } = require('../config/db'); // This extracts ONLY the MySQL pool

const Stock = {
    // Add new hardware to inventory
  create: async (data) => {
    const sql = `
        INSERT INTO stock 
        (category, brand, model_no, total_quantity, available_quantity,user_id)
        VALUES (?, ?, ?, ?, ?,?)
    `;

    const values = [
        data.category,
        data.brand,
        data.model_no,
        data.qty,
        data.qty,
        data.user_id
    ];

    const [result] = await pool.query(sql, values);

    return result;
},

 assignToEmployee: async (data) => {
    const { item_id, emp_id, emp_name, qty_assigned,user_id } = data;

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // 🔒 Lock stock row
      const [rows] = await conn.query(
        `SELECT available_quantity 
           FROM stock 
          WHERE item_id = ? 
          FOR UPDATE`,
        [item_id]
      );

      if (!rows.length) {
        const err = new Error("Stock item not found");
        err.sqlState = "45000";
        throw err;
      }

      const available = Number(rows[0].available_quantity);

      if (available < qty_assigned) {
        const err = new Error(`Not enough stock. Available: ${available}`);
        err.sqlState = "45000";
        throw err;
      }

      // 📝 Insert employee assignment
      await conn.query(
        `INSERT INTO employee_assign 
         (item_id, emp_id, emp_name, qty_assigned,user_id, status)
         VALUES (?, ?, ?, ?,?, 'Active')`,
        [item_id, emp_id, emp_name, qty_assigned,user_id]
      );

      // 📉 Reduce stock
      await conn.query(
        `UPDATE stock
            SET available_quantity = available_quantity - ?
          WHERE item_id = ?`,
        [qty_assigned, item_id]
      );

      await conn.commit();
      return true;

    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

    // Get current inventory status
   getInventory: async () => {
    const sql = `SELECT * FROM stock ORDER BY category ASC`;
    const [rows] = await pool.query(sql);
    return rows;
},


    // Get current inventory status
   getAssignlist: async () => {
    const sql = `SELECT * FROM employee_assign ORDER BY assign_id ASC`;
    const [rows] = await pool.query(sql);
    return rows;
},


 updateEmployeeAssign: async (id, data) => {
    const { item_id, emp_id,user_id, emp_name, qty_assigned, tag, status } = data;

    const sql = `
      UPDATE employee_assign
         SET item_id = ?,
             emp_id = ?,
             user_id=?,
             emp_name = ?,
             qty_assigned = ?,
             tag = ?,
             status = ?
       WHERE assign_id = ?
    `;

    const [result] = await pool.query(sql, [
      item_id,
      emp_id,
      user_id,
      emp_name,
      qty_assigned,
      tag ?? null,
      status,
      id
    ]);

    return result;
  },





};

module.exports = Stock;