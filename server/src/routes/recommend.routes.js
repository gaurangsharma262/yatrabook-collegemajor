const express = require('express');
const router = express.Router();
const { getCheapest, getFastest, planMultiCity } = require('../controllers/recommend.controller');

// GET /api/recommend/cheapest?from=Delhi&to=Mumbai
router.get('/cheapest', getCheapest);

// GET /api/recommend/fastest?from=Delhi&to=Mumbai
router.get('/fastest', getFastest);

// POST /api/recommend/multi-city { cities: ["Delhi", "Jaipur", "Mumbai"] }
router.post('/multi-city', planMultiCity);

module.exports = router;
