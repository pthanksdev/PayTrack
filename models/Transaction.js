const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  gateway: { type: String, enum: ['stripe', 'paypal', 'manual'], default: 'manual' },
  gatewayTransactionId: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update updatedAt
transactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);