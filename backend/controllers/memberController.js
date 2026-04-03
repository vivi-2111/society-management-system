const { query, execute } = require('../config/db');

exports.getMembers = async (req, res) => {
    try {
        const rows = await query(`SELECT * FROM members ORDER BY member_id DESC`);
        const formatted = rows.map(r => ({
            MEMBER_ID: r.member_id,
            NAME: r.name,
            FLAT_NUMBER: r.flat_number,
            PHONE: r.phone
        }));
        res.json(formatted);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const bcrypt = require('bcrypt');

exports.addMember = async (req, res) => {
    try {
        const hash = await bcrypt.hash('member123', 10);
        await execute(`INSERT INTO members (member_id, name, flat_number, phone, password_hash) VALUES (member_seq.NEXTVAL, :1, :2, :3, :4)`, 
            [req.body.name, req.body.flat_number, req.body.phone, hash]);
        res.status(201).json({ message: 'Member added successfully (Default Password: member123)' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateMember = async (req, res) => {
    try {
        await execute(`UPDATE members SET name = :1, flat_number = :2, phone = :3 WHERE member_id = :4`, 
                      [req.body.name, req.body.flat_number, req.body.phone, req.params.id]);
        res.json({ message: 'Member updated successfully' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteMember = async (req, res) => {
    try {
        await execute(`DELETE FROM members WHERE member_id = :1`, [req.params.id]);
        res.json({ message: 'Member deleted successfully' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};
