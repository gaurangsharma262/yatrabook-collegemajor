const express = require('express');
const router = express.Router();
const { searchFlights, getFlightById, getAirports } = require('../controllers/flight.controller');
const { optionalAuth } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { searchSchema } = require('../validators/search.validator');

// GET /api/flights/search?from=Delhi&to=Mumbai
router.get('/search', optionalAuth, validate(searchSchema, 'query'), searchFlights);

// GET /api/flights/airports
router.get('/airports', getAirports);

// GET /api/flights/:id
router.get('/:id', getFlightById);

module.exports = router;
