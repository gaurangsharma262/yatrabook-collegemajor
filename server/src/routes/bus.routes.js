const express = require('express');
const router = express.Router();
const { searchBuses, getBusById, getOperators } = require('../controllers/bus.controller');
const { optionalAuth } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { searchSchema } = require('../validators/search.validator');

// GET /api/buses/search?from=Bangalore&to=Chennai
router.get('/search', optionalAuth, validate(searchSchema, 'query'), searchBuses);

// GET /api/buses/operators
router.get('/operators', getOperators);

// GET /api/buses/:id
router.get('/:id', getBusById);

module.exports = router;
