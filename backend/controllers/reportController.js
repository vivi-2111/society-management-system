const { query } = require('../config/db');

exports.getDashboardSummary = async (req, res) => {
    try {
        const incomeRow = await query(`SELECT SUM(amount) AS total_income FROM payments WHERE status = 'paid'`);
        const totalIncome = incomeRow[0]?.total_income || 0;

        const expensesRow = await query(`SELECT SUM(amount) AS total_expenses FROM expenses`);
        const totalExpenses = expensesRow[0]?.total_expenses || 0;

        const pendingRow = await query(`SELECT SUM(amount) AS total_pending FROM payments WHERE status = 'unpaid'`);
        const totalPending = pendingRow[0]?.total_pending || 0;

        const recentPayments = await query(`SELECT p.payment_id, m.name, p.amount, p.status, p.payment_date 
             FROM payments p JOIN members m ON p.member_id = m.member_id 
             ORDER BY p.payment_id DESC FETCH FIRST 5 ROWS ONLY`);

        const formattedRecent = recentPayments.map(r => ({
            PAYMENT_ID: r.payment_id, NAME: r.name, AMOUNT: r.amount, STATUS: r.status, PAYMENT_DATE: r.payment_date
        }));

        res.json({
            totalIncome,
            totalExpenses,
            balance: totalIncome - totalExpenses,
            totalPending,
            recentTransactions: formattedRecent
        });
    } catch (err) { res.status(500).send('Server Error'); }
};
