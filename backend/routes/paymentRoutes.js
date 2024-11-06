const express = require('express');
const { createPayment, getPayments, updatePaymentStatus, createBuyPayment, editPayment } = require('../controllers/paymentController');

const router = express.Router();

// Route to create a payment
router.post('/pay', createPayment);
router.put('/pay/:paymentId/status', updatePaymentStatus);
router.post('/buy', createBuyPayment);

// Route to get all payments
router.get('/', getPayments);
router.put('/:paymentId', editPayment);

module.exports = router;