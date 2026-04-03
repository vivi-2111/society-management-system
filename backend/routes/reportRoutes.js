const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/authMiddleware');

router.get('/summary', auth, reportController.getDashboardSummary);

module.exports = router;
