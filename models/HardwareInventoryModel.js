const oracledb = require('oracledb');
const { connectToOracle } = require('../config/db');

const getRequisitionsFromDb = async (filters) => {
    let conn;
    try {
        conn = await connectToOracle();
        
        // Ensure aliases match your required key names exactly
        const sql = `
            SELECT 
                ISSUE_TO AS EMP_ID, 
                GET_EMPNAME(ISSUE_TO) AS EMP_NAME,
                REQUISITION_NO, 
                ISSUED_QTY, 
                ISSUE_DATE, 
                COM_ISSUE_DETAIL_ID,
                ITEM_CODE, 
                GET_CS_ITEMNAME(ITEM_CODE) AS ITEMNAME, 
                REMARKS,
                GET_Com_ISSUEPRICE(ITEM_CODE, REQUISITION_NO) AS VALUE,
                (SELECT INV_NO FROM COM_STORE_REQ_MASTER 
                 WHERE INV_NO IS NOT NULL AND REQUISITION_NO = D.REQUISITION_NO) AS INV_NO
            FROM COM_ISSUE_MASTER M, COM_ISSUE_DETAIL D
            WHERE M.ISSUE_ID = D.ISSUE_ID
            AND ISSUE_STATUS IS NULL
            AND ISSUE_DATE BETWEEN TO_DATE(:p_start_date, 'DD/MM/YYYY') AND TO_DATE(:p_end_date, 'DD/MM/YYYY')
            AND ISSUE_TO = NVL(:p_idno, ISSUE_TO)
            ORDER BY ISSUE_DATE
        `;

        const result = await conn.execute(
            sql, 
            {
                p_start_date: filters.startDate,
                p_end_date:   filters.endDate,
                p_idno:       filters.empId || null
            }, 
            { outFormat: oracledb.OUT_FORMAT_OBJECT } // This converts rows to { EMP_ID: "..." }
        );

        return result.rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) {
            await conn.close();
        }
    }
};


const getHardwareWokredinfo = async (filters) => {
    let conn;
    try {
        conn = await connectToOracle();
        
        const sql = `
            SELECT * FROM COM_HARDWARE_INFO 
            WHERE RECEIVED_BY = :p_received_by
            AND (
                (DELIVERED_DATE BETWEEN TO_DATE(:p_start_date, 'DD-MM-YYYY') 
                                   AND TO_DATE(:p_end_date, 'DD-MM-YYYY'))
                OR 
                (:p_start_date IS NULL OR :p_end_date IS NULL)
            )
            ORDER BY DELIVERED_DATE DESC
        `;

        const result = await conn.execute(
            sql, 
            {
                p_received_by: filters.receivedBy,
                p_start_date:  filters.startDate || null,
                p_end_date:    filters.endDate || null
            }, 
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows;
    } catch (err) {
        console.error("Database Error:", err);
        throw err;
    } finally {
        if (conn) await conn.close();
    }
};



const getHardwareWorkAllinfo = async (filters) => {
    let conn;
    try {
        conn = await connectToOracle();
        
        // Use your specific SQL logic
        const sql = `
            SELECT * FROM COM_HARDWARE_INFO 
            WHERE (
                (DELIVERED_DATE BETWEEN TO_DATE(:p_start_date, 'DD-MM-YYYY') 
                                   AND TO_DATE(:p_end_date, 'DD-MM-YYYY'))
                OR 
                (:p_start_date IS NULL AND :p_end_date IS NULL)
            )
            ORDER BY DELIVERED_DATE DESC
        `;

        const result = await conn.execute(
            sql, 
            {
                p_start_date: filters.startDate || null,
                p_end_date:   filters.endDate || null
            }, 
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows;
    } catch (err) {
        console.error("Model Error:", err);
        throw err;
    } finally {
        if (conn) await conn.close();
    }
};



module.exports = { getRequisitionsFromDb,getHardwareWokredinfo ,getHardwareWorkAllinfo};