const { query, execute } = require('../config/db');

exports.getExpenses = async (req, res) => {
    try {
        const rows = await query(`SELECT * FROM expenses ORDER BY expense_id DESC`);
        const formatted = rows.map(r => ({
            EXPENSE_ID: r.expense_id, CATEGORY: r.category, AMOUNT: r.amount, DESCRIPTION: r.description, EXPENSE_DATE: r.expense_date
        }));
        res.json(formatted);
    } catch (err) { res.status(500).send('Server Error'); }
};

exports.addExpense = async (req, res) => {
    try {
        await execute(`INSERT INTO expenses (expense_id, category, amount, description) VALUES (expense_seq.NEXTVAL, :1, :2, :3)`, 
                      [req.body.category, req.body.amount, req.body.description]);
        res.status(201).json({ message: 'Expense added successfully' });
    } catch (err) { res.status(500).send('Server Error'); }
};
