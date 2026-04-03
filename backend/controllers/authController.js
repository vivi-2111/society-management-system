const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // First check admins
        const adminRows = await query(`SELECT admin_id, password_hash FROM admins WHERE username = :1`, [username]);
        
        if (adminRows.length > 0) {
            const admin = adminRows[0];
            const isMatch = await bcrypt.compare(password, admin.password_hash);
            if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });
            
            const payload = { user: { id: admin.admin_id, role: 'admin' } };
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: admin.admin_id, username, role: 'admin' } });
            });
            return;
        }

        // If not admin, check members by flat_number
        const memberRows = await query(`SELECT member_id, flat_number, password_hash FROM members WHERE flat_number = :1`, [username]);
        
        if (memberRows.length > 0) {
            const member = memberRows[0];
            const isMatch = await bcrypt.compare(password, member.password_hash);
            if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });
            
            const payload = { user: { id: member.member_id, role: 'member' } };
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: member.member_id, username: member.flat_number, role: 'member' } });
            });
            return;
        }

        return res.status(400).json({ message: 'Invalid Credentials' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
