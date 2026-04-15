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

const getHardwareAssignedAllinfo = async (filters) => {
    let conn;
    try {
        conn = await connectToOracle();
        
        // Use your specific SQL logic
        const sql = `
            SELECT * FROM COM_HARDWARE_INFO 
            WHERE (
                (INSERT_DATE BETWEEN TO_DATE(:p_start_date, 'DD-MM-YYYY') 
                                   AND TO_DATE(:p_end_date, 'DD-MM-YYYY'))
                OR 
                (:p_start_date IS NULL AND :p_end_date IS NULL)
            )
            ORDER BY INSERT_DATE DESC
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


const insertHardwareInfo = async (data) => {
    let connection;
    try {
        connection = await connectToOracle();

        const sql = `
            INSERT INTO com_hardware_info
            (
                hardware_id, inv_no, item_code, model, material_brand_id, job_description,
                remarks, section, b_code, z_code, project, received_name,
                received_by, received_date, delivered_name, delivered_by, delivered_date,
                status, requisition_no, insert_by, insert_date, hardware_date,
                assist_by, assist_name, emp_id, serial_no, mobile_no,
                eng_id, eng_name, work_status -- New Columns Added Here
            )
            VALUES
            (
                (SELECT LPAD(TO_CHAR(NVL(MAX(TO_NUMBER(hardware_id)), 0) + 1), 5, '0') FROM com_hardware_info),
                :inv_no, :item_code, :model, :material_brand_id, :job_description,
                :remarks, :section, :b_code, :z_code, :project, :received_name,
                :received_by, TO_DATE(:received_date, 'YYYY-MM-DD'), 
                :delivered_name, :delivered_by, TO_DATE(:delivered_date, 'YYYY-MM-DD'),
                :status, :requisition_no, :insert_by, SYSDATE, 
                TO_DATE(:hardware_date, 'YYYY-MM-DD'),
                :assist_by, :assist_name, :emp_id, :serial_no, :mobile_no,
                :eng_id, :eng_name, 'ASSIGNED' -- Values for new columns
            )`;

        // Ensure 'data' object contains keys: eng_id and eng_name
        const result = await connection.execute(sql, data, { autoCommit: true });
        return result;
    } catch (err) {
        console.error("Model Error (Oracle):", err.message);
        throw err; 
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (e) {
                console.error("Connection Close Error:", e);
            }
        }
    }
};


async function updateHardwareInfo(data) {
    let connection;
    try {
        connection = await connectToOracle();
        
        const sql = `
            UPDATE COM_HARDWARE_INFO
            SET 
                INV_NO = :inv_no,
                ITEM_CODE = :item_code,
                MODEL = :model,
                MATERIAL_BRAND_ID = :material_brand_id,
                JOB_DESCRIPTION = :job_description,
                REMARKS = :remarks,
                SECTION = :section,
                B_CODE = :b_code,
                Z_CODE = :z_code,
                PROJECT = :project,
                RECEIVED_NAME = :received_name,
                RECEIVED_BY = :received_by,
                RECEIVED_DATE = TO_DATE(:received_date, 'YYYY-MM-DD'),
                DELIVERED_NAME = :delivered_name,
                DELIVERED_BY = :delivered_by,
                DELIVERED_DATE = TO_DATE(:delivered_date, 'YYYY-MM-DD'),
                STATUS = :status,
                REQUISITION_NO = :requisition_no,
                UPDATE_BY = :update_by,
                HARDWARE_DATE = TO_DATE(:hardware_date, 'YYYY-MM-DD'),
                ASSIST_BY = :assist_by,
                ASSIST_NAME = :assist_name,
                SERIAL_NO = :serial_no,
                MOBILE_NO = :mobile_no,
                
                -- New Columns Added Here
                ENG_ID = :eng_id,
                ENG_NAME = :eng_name,
                WORK_STATUS = :work_status,
                ENG_COMMENTS = :eng_comments,
                
                -- Automatically set Complete Date if work is finished
                COMPLETE_DT = CASE WHEN :work_status = 'COMPLETED' THEN SYSDATE ELSE COMPLETE_DT END,
                
                UPDATE_DATE = SYSDATE
            WHERE TRIM(HARDWARE_ID) = TRIM(:hardware_id)`;

        // Ensure your data object includes eng_id, eng_name, work_status, and eng_comments
        const result = await connection.execute(sql, data, { autoCommit: true });
        return result;
    } catch (err) {
        console.error("Update Error:", err.message);
        throw err;
    } finally {
        if (connection) await connection.close();
    }
}


const getItemsByGroup = async () => {
    let connection;
    try {
        connection = await connectToOracle();

        const sql = `
            SELECT item_code, item_desc, gr_code, gr_sub_code
            FROM cs_items
            WHERE gr_code = :groupCode
            AND item_code NOT IN (:excludeCode)
            ORDER BY item_code
        `;

        const result = await connection.execute(
            sql, 
            { groupCode: '06', excludeCode: '01845' }, 
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows;
    } catch (err) {
        throw err;
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
};


const getAllBrands = async () => {
    let connection;
    try {
        connection = await connectToOracle();

        const sql = `
            SELECT material_brand_id, brand_name
            FROM cs_material_brand
            ORDER BY brand_name
        `;

        const result = await connection.execute(
            sql,
            [], // No bind variables needed
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows;
    } catch (err) {
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (e) {
                console.error("Connection Close Error:", e);
            }
        }
    }
};
const getModelsByItem = async (itemCode) => {
    let connection;
    try {
        connection = await connectToOracle();

        const sql = `
            SELECT MODEL_NAME
            FROM COM_HARDWARE_ITEM_MODEL
            WHERE ITEM_CODE = :itemCode
            ORDER BY MODEL_NAME
        `;

        const result = await connection.execute(
            sql,
            { itemCode: itemCode },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows;
    } catch (err) {
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (e) {
                console.error("Connection Close Error:", e);
            }
        }
    }
};

const getProblemsByItem = async (itemCode) => {
    let connection;
    try {
        connection = await connectToOracle();

        const sql = `
            SELECT PROBLEM_NAME
            FROM COM_HARDWARE_ITEM_PROBLEM
            WHERE ITEM_CODE = :itemCode
            ORDER BY PROBLEM_NAME
        `;

        const result = await connection.execute(
            sql,
            { itemCode: itemCode },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows;
    } catch (err) {
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (e) {
                console.error("Connection Close Error:", e);
            }
        }
    }
};

const getITEmployees = async () => {
    let connection;
    try {
        connection = await connectToOracle();

        const sql = `
            SELECT emp_id, emp_name, DEGN_NAME AS vc_degn, DEPT_NAME AS dept, BRANCH_NAME AS branch
            FROM EMP_INFO
            WHERE DEPT_NAME = :deptName
            AND BRANCH_NAME = :branchName
            ORDER BY emp_id
        `;

        const result = await connection.execute(
            sql,
            { deptName: 'IT', branchName: 'HEAD OFFICE' },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows;
    } catch (err) {
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (e) {
                console.error("Connection Close Error:", e);
            }
        }
    }
};



const getAllSections = async () => {
    let connection;
    try {
        connection = await connectToOracle();

        const sql = `
            SELECT section_id, section_name, remarks
            FROM cs_section
            ORDER BY section_name
        `;

        const result = await connection.execute(
            sql,
            [], // No filters needed
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows;
    } catch (err) {
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (e) {
                console.error("Connection Close Error:", e);
            }
        }
    }
};



const getBranchZoneInfo = async () => {
    let connection;
    try {
        connection = await connectToOracle();

        const sql = `
            SELECT branch_code, branch_name, zone_code, zone_name, project
            FROM v_branch_zone_info
            ORDER BY branch_code
        `;

        const result = await connection.execute(
            sql,
            [], 
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows;
    } catch (err) {
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (e) {
                console.error("Connection Close Error:", e);
            }
        }
    }
};


const getHardwareById = async (hardwareId) => {
    let connection;
    try {
        connection = await connectToOracle();

        const sql = `
            SELECT 
                p.hardware_id, p.inv_no, p.item_code, c.item_desc AS item_name, 
                p.model, p.material_brand_id, m.brand_name, p.job_description, 
                p.remarks, p.section, p.b_code, p.z_code, p.project, 
                p.received_by, p.received_date, p.delivered_by, p.delivered_date,
                p.received_name, p.delivered_name, p.requisition_no, p.status, 
                b.branch_name, b.zone_name, p.assist_by, p.assist_name, 
                p.emp_id, p.serial_no, p.mobile_no,
                
                -- New Engineering Fields Added Here
                p.eng_id, 
                p.eng_name, 
                p.work_status, 
                p.eng_comments,
                p.complete_dt
            FROM com_hardware_info p
            LEFT JOIN v_branch_zone_info b ON p.b_code = b.branch_code
            INNER JOIN cs_items c ON p.item_code = c.item_code
            INNER JOIN cs_material_brand m ON p.material_brand_id = m.material_brand_id
            WHERE TRIM(p.hardware_id) = TRIM(:hardwareId)
        `;

        const result = await connection.execute(
            sql,
            { hardwareId: hardwareId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows[0]; // Return the single record found
    } catch (err) {
        console.error("Fetch Error (Oracle):", err.message);
        throw err;
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
};

const getStatusList = async () => {
    // Static list as per your requirement
    const statusData = [
        { status_id: 1, status_name: "Repair" },
        { status_id: 2, status_name: "Replace" },
        { status_id: 3, status_name: "New" }
    ];
    
    return Promise.resolve(statusData);
};



const getEngIdWiseWorklist = async (engId) => {
    let connection;
    try {
        connection = await connectToOracle();

        const sql = `
            SELECT 
                p.*, 
                c.item_desc AS item_name, 
                m.brand_name,
                b.branch_name, 
                b.zone_name
            FROM COM_HARDWARE_INFO p
            LEFT JOIN v_branch_zone_info b ON p.b_code = b.branch_code
            LEFT JOIN cs_items c ON p.item_code = c.item_code
            LEFT JOIN cs_material_brand m ON p.material_brand_id = m.material_brand_id
            WHERE p.ENG_ID = :engId 
            ORDER BY p.INSERT_DATE DESC
        `;

        const result = await connection.execute(
            sql,
            { engId: engId }, 
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows;
    } catch (err) {
        console.error("Full Worklist Fetch Error:", err.message);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (e) {
                console.error("Connection Close Error:", e);
            }
        }
    }
};



async function updateToWorking(data) {
    let connection;
    try {
        connection = await connectToOracle();

        const sql = `
            UPDATE COM_HARDWARE_INFO 
            SET 
                WORK_STATUS = :work_status
            WHERE 
                HARDWARE_ID = :hardware_id
        `;

        const binds = {
            work_status: data.work_status, // Value is "WORKING"
            hardware_id: data.hardware_id
        };

        const result = await connection.execute(sql, binds, { autoCommit: true });
        return result;

    } catch (err) {
        console.error("Model Update Error:", err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error("Error closing Oracle connection:", closeErr);
            }
        }
    }
}


async function finalizeTask(data) {
    let connection;
    try {
        connection = await connectToOracle(); // Use your existing connection helper

        const sql = `
            UPDATE COM_HARDWARE_INFO 
            SET 
                ASSIST_BY = :assist_by,
                ASSIST_NAME = :assist_name,
                WORK_STATUS = :work_status,
                ENG_COMMENTS = :eng_comments,
                COMPLETE_DT = SYSDATE,
                UPDATE_DATE = SYSDATE
            WHERE 
                HARDWARE_ID = :hardware_id
        `;

        const binds = {
            assist_by: data.assist_by,
            assist_name: data.assist_name,
            work_status: data.work_status,
            eng_comments: data.eng_comments,
            hardware_id: data.hardware_id
        };

        const result = await connection.execute(sql, binds, { autoCommit: true });
        return result;

    } catch (err) {
        console.error("Oracle Update Error:", err);
        throw err;
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}


module.exports = {finalizeTask,updateToWorking,getEngIdWiseWorklist,getHardwareAssignedAllinfo,updateHardwareInfo,getStatusList,getHardwareById,getBranchZoneInfo,getAllSections,getITEmployees,getProblemsByItem,getModelsByItem,getAllBrands,getItemsByGroup,insertHardwareInfo, getRequisitionsFromDb,getHardwareWokredinfo ,getHardwareWorkAllinfo};