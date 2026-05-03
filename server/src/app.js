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
  origin: true, // Allow all origins for easier deployment
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

// ─── One-time Seed Endpoint ────────────────────────────────────
app.post('/api/seed', async (req, res) => {
  const secret = req.headers['x-seed-secret'];
  if (secret !== (env.JWT_SECRET || 'yatrabook_jwt_secret_2026_super_secure_key')) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const Train  = require('./models/Train');
    const Flight = require('./models/Flight');
    const Bus    = require('./models/Bus');
    const User   = require('./models/User');

    const tCount = await Train.countDocuments();
    const fCount = await Flight.countDocuments();
    const bCount = await Bus.countDocuments();

    if (tCount > 0 || fCount > 0 || bCount > 0) {
      return res.json({ success: true, message: `Already seeded: ${tCount} trains, ${fCount} flights, ${bCount} buses` });
    }

    const { generateFallbackTrains, generateFallbackFlights, generateBuses } = require('../data/seed-data');
    const trains  = generateFallbackTrains();
    const flights = generateFallbackFlights();
    const buses   = generateBuses();

    await Train.insertMany(trains);
    await Flight.insertMany(flights);
    await Bus.insertMany(buses);

    const existing = await User.findOne({ email: 'demo@yatrabook.com' });
    if (!existing) {
      await User.create({ name: 'Demo User', email: 'demo@yatrabook.com', password: 'demo123456', phone: '9876543210', role: 'user' });
    }

    res.json({ success: true, message: `Seeded: ${trains.length} trains, ${flights.length} flights, ${buses.length} buses. Demo: demo@yatrabook.com / demo123456` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── API Routes ────────────────────────────────────────────────
const routes = [
  { path: 'auth', router: require('./routes/auth.routes') },
  { path: 'users', router: require('./routes/user.routes') },
  { path: 'trains', router: require('./routes/train.routes') },
  { path: 'flights', router: require('./routes/flight.routes') },
  { path: 'buses', router: require('./routes/bus.routes') },
  { path: 'bookings', router: require('./routes/booking.routes') },
  { path: 'recommend', router: require('./routes/recommend.routes') },
];

routes.forEach(({ path, router }) => {
  app.use(`/api/${path}`, router); // Standard path
  app.use(`/${path}`, router);     // Fallback if frontend VITE_API_URL is missing /api
});

// ─── Error Handling ────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
