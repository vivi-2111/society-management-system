const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, expenseController.getExpenses);
router.post('/', auth, expenseController.addExpense);

module.exports = router;
