const oracledb = require('oracledb');
const bcrypt = require('bcrypt');
require('dotenv').config();

oracledb.autoCommit = true;
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; // Return results as objects with column names

let connection;

// Initialize connection pool
async function initConnection() {
    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER || 'MYUSER',
            password: process.env.DB_PASSWORD || 'MYPASSWORD',
            connectionString: process.env.DB_CONNECTION_STRING || 'localhost:1521/xe'
        });
        console.log('Successfully connected to Oracle Database.');
        await initializeDB();
    } catch (err) {
        console.error('Error connecting to Oracle DB:', err.message);
        setTimeout(initConnection, 5000); // Retry after 5 seconds
    }
}

// Execute query (INSERT, UPDATE, DELETE)
const execute = async (sql, params = []) => {
    try {
        const result = await connection.execute(sql, params, { autoCommit: true });
        return { rowsAffected: result.rowsAffected };
    } catch (err) {
        console.error('Execute error:', err);
        throw err;
    }
};

// Query data (SELECT)
const query = async (sql, params = []) => {
    try {
        const result = await connection.execute(sql, params);
        if (!result.rows) return [];
        return result.rows.map(row => {
            const lowerRow = {};
            for (let key in row) {
                lowerRow[key.toLowerCase()] = row[key];
            }
            return lowerRow;
        });
    } catch (err) {
        console.error('Query error:', err);
        throw err;
    }
};

async function initializeDB() {
    try {
        // Check if tables exist and insert default data
        const adminRows = await query(`SELECT COUNT(*) as count FROM admins`);
        if (adminRows[0].COUNT === 0) {
            const hash = await bcrypt.hash('lathi123', 10);
            await execute(
                `INSERT INTO admins (admin_id, username, password_hash) VALUES (admin_seq.NEXTVAL, :1, :2)`,
                ['lathika', hash]
            );
            console.log('Inserted default admin lathika.');
        }

        // Insert dummy data if members table is empty
        const memberRows = await query(`SELECT COUNT(*) as count FROM members`);
        if (memberRows[0].COUNT === 0) {
            await execute(
                `INSERT INTO members (member_id, name, flat_number, phone) VALUES (member_seq.NEXTVAL, :1, :2, :3)`,
                ['John Doe', 'A-101', '1234567890']
            );
            await execute(
                `INSERT INTO members (member_id, name, flat_number, phone) VALUES (member_seq.NEXTVAL, :1, :2, :3)`,
                ['Jane Smith', 'B-202', '0987654321']
            );
            await execute(
                `INSERT INTO members (member_id, name, flat_number, phone) VALUES (member_seq.NEXTVAL, :1, :2, :3)`,
                ['Alice Johnson', 'C-305', '5551234567']
            );

            // Insert dummy payments
            await execute(
                `INSERT INTO payments (payment_id, member_id, amount, month_year, status, payment_date) VALUES (payment_seq.NEXTVAL, :1, :2, :3, :4, SYSDATE)`,
                [1, 1500, '2023-10', 'paid']
            );
            await execute(
                `INSERT INTO payments (payment_id, member_id, amount, month_year, status) VALUES (payment_seq.NEXTVAL, :1, :2, :3, :4)`,
                [2, 1500, '2023-10', 'unpaid']
            );
            console.log('Inserted dummy data.');
        }
    } catch (err) {
        console.error("DB Init error:", err);
    }
}

// Start connection on module load
initConnection();

module.exports = { connection, execute, query };
