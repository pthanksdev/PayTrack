const express = require('express');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Transaction = require('../models/Transaction');
const Invoice = require('../models/Invoice');
const AuditLog = require('../models/AuditLog');
const auth = require('../middleware/auth');

const router = express.Router();

// Middleware to check admin role
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// Get all users
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all payments
router.get('/payments', auth, adminAuth, async (req, res) => {
  try {
    const payments = await Payment.find().populate('userId', 'username email');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all transactions
router.get('/transactions', auth, adminAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('userId', 'username email');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get audit logs
router.get('/audit-logs', auth, adminAuth, async (req, res) => {
  try {
    const logs = await AuditLog.find().populate('userId', 'username email').sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deactivate user
router.patch('/users/:id/deactivate', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;