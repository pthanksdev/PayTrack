const express = require('express');
const AuditLog = require('../models/AuditLog');
const Payment = require('../models/Payment');
const Transaction = require('../models/Transaction');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Stripe webhook
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Log the event
  const log = new AuditLog({
    action: 'webhook_received',
    resource: 'webhook',
    details: { event: event.type, payload: event.data.object },
  });
  await log.save();

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Update payment status
      await Payment.findOneAndUpdate(
        { transactionId: paymentIntent.id },
        { status: 'completed' }
      );
      // Create transaction
      const transaction = new Transaction({
        userId: paymentIntent.metadata.userId,
        amount: paymentIntent.amount / 100,
        type: 'credit',
        status: 'completed',
        gateway: 'stripe',
        gatewayTransactionId: paymentIntent.id,
      });
      await transaction.save();
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Generic webhook
router.post('/', async (req, res) => {
  try {
    const log = new AuditLog({
      action: 'webhook_received',
      resource: 'webhook',
      details: req.body,
    });
    await log.save();
    res.status(200).json({ received: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get webhook logs (admin)
router.get('/logs', async (req, res) => {
  try {
    const logs = await AuditLog.find({ resource: 'webhook' }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;