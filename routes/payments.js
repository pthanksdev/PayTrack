const express = require('express');
const Payment = require('../models/Payment');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const { validate, paymentSchema } = require('../middleware/validation');
const auditLog = require('../middleware/audit');

const router = express.Router();

// Get all payments for user
router.get('/', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create payment
router.post('/', auth, validate(paymentSchema), auditLog('create', 'payment'), async (req, res) => {
  try {
    const payment = new Payment({ ...req.body, userId: req.user.id });
    await payment.save();
    // Create transaction
    const transaction = new Transaction({
      userId: req.user.id,
      paymentId: payment._id,
      amount: payment.amount,
      type: 'credit',
      description: payment.description,
      status: payment.status,
    });
    await transaction.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update payment status
router.patch('/:id', auth, auditLog('update', 'payment'), async (req, res) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete payment
router.delete('/:id', auth, auditLog('delete', 'payment'), async (req, res) => {
  try {
    const payment = await Payment.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;