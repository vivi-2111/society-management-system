const { query, execute } = require('../config/db');

exports.getPayments = async (req, res) => {
    try {
        let rows = [];
        if (req.user && req.user.role === 'member') {
            rows = await query(`SELECT p.payment_id, p.member_id, m.name as member_name, m.flat_number, p.amount, p.month_year, p.status, p.payment_date 
                 FROM payments p JOIN members m ON p.member_id = m.member_id WHERE p.member_id = :1 ORDER BY p.payment_id DESC`, [req.user.id]);
        } else {
            rows = await query(`SELECT p.payment_id, p.member_id, m.name as member_name, m.flat_number, p.amount, p.month_year, p.status, p.payment_date 
                 FROM payments p JOIN members m ON p.member_id = m.member_id ORDER BY p.payment_id DESC`);
        }
        
        const formatted = rows.map(r => ({
            PAYMENT_ID: r.payment_id, MEMBER_ID: r.member_id, MEMBER_NAME: r.member_name, 
            FLAT_NUMBER: r.flat_number, AMOUNT: r.amount, MONTH_YEAR: r.month_year, STATUS: r.status, PAYMENT_DATE: r.payment_date
        }));
        res.json(formatted);
    } catch (err) { res.status(500).send('Server Error'); }
};

exports.addPayment = async (req, res) => {
    try {
        if (req.body.status === 'paid') {
            await execute(`INSERT INTO payments (payment_id, member_id, amount, month_year, status, payment_date) VALUES (payment_seq.NEXTVAL, :1, :2, :3, :4, SYSDATE)`, 
                          [req.body.member_id, req.body.amount, req.body.month_year, req.body.status]);
        } else {
            await execute(`INSERT INTO payments (payment_id, member_id, amount, month_year, status) VALUES (payment_seq.NEXTVAL, :1, :2, :3, :4)`, 
                          [req.body.member_id, req.body.amount, req.body.month_year, req.body.status]);
        }
        res.status(201).json({ message: 'Payment added successfully' });
    } catch (err) { res.status(500).send('Server Error'); }
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        if (req.body.status === 'paid') {
             await execute(`UPDATE payments SET status = 'paid', payment_date = SYSDATE WHERE payment_id = :1`, [req.params.id]);
        } else {
             await execute(`UPDATE payments SET status = 'unpaid', payment_date = NULL WHERE payment_id = :1`, [req.params.id]);
        }
        res.json({ message: 'Payment status updated' });
    } catch (err) { res.status(500).send('Server Error'); }
};

exports.bulkAddPayments = async (req, res) => {
    try {
        const { amount, month_year, status } = req.body;
        // Fetch all members
        const members = await query(`SELECT member_id FROM members`);
        
        // Insert a payment record for each member
        for (const member of members) {
            if (status === 'paid') {
                await execute(`INSERT INTO payments (payment_id, member_id, amount, month_year, status, payment_date) VALUES (payment_seq.NEXTVAL, :1, :2, :3, :4, SYSDATE)`, 
                              [member.member_id, amount, month_year, status]);
            } else {
                await execute(`INSERT INTO payments (payment_id, member_id, amount, month_year, status) VALUES (payment_seq.NEXTVAL, :1, :2, :3, :4)`, 
                              [member.member_id, amount, month_year, status]);
            }
        }
        res.status(201).json({ message: `Successfully generated ${members.length} bills!` });
    } catch (err) { res.status(500).json({ error: err.message }); }
};
