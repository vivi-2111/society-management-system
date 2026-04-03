const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, paymentController.getPayments);
router.post('/bulk', auth, paymentController.bulkAddPayments);
router.post('/', auth, paymentController.addPayment);
router.put('/:id', auth, paymentController.updatePaymentStatus);

module.exports = router;
