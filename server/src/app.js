const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
const { apiLimiter } = require('./middleware/rateLimiter.middleware');

const app = express();

// ─── Security Middleware ───────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsing ──────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ───────────────────────────────────────────────────
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Rate Limiting ─────────────────────────────────────────────
app.use('/api/', apiLimiter);

// ─── Health Check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 YatraBook API is running',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ────────────────────────────────────────────────
// Will be added in Phase 2-4
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/trains', require('./routes/train.routes'));
app.use('/api/flights', require('./routes/flight.routes'));
app.use('/api/buses', require('./routes/bus.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/recommend', require('./routes/recommend.routes'));

// ─── Error Handling ────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
