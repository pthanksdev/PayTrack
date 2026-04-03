const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const winston = require('winston');
require('dotenv').config();

const { generalLimiter } = require('./middleware/rateLimit');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(mongoSanitize());
app.use(xss());
app.use(generalLimiter);

// Logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/paytrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Static landing page
app.use(express.static('public'));

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/payments', require('./routes/payments'));
app.use('/api/v1/transactions', require('./routes/transactions'));
app.use('/api/v1/invoices', require('./routes/invoices'));
app.use('/api/v1/webhooks', require('./routes/webhooks'));
app.use('/api/v1/admin', require('./routes/admin'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;