const express = require('express');
const router = express.Router();
const { searchTrains, getTrainById, checkAvailability, getStations, getPopularRoutes } = require('../controllers/train.controller');
const { optionalAuth } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { searchSchema } = require('../validators/search.validator');

// GET /api/trains/search?from=Delhi&to=Mumbai&sort=price_asc
router.get('/search', optionalAuth, validate(searchSchema, 'query'), searchTrains);

// GET /api/trains/stations
router.get('/stations', getStations);

// GET /api/trains/popular
router.get('/popular', getPopularRoutes);

// GET /api/trains/:id
router.get('/:id', getTrainById);

// GET /api/trains/:id/availability?class=SL
router.get('/:id/availability', checkAvailability);

module.exports = router;
