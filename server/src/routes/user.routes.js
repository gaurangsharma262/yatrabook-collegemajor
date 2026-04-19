const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getRecentSearches, clearRecentSearches } = require('../controllers/user.controller');
const { auth } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { updateProfileSchema } = require('../validators/auth.validator');

// All routes require authentication
router.use(auth);

// GET /api/users/profile
router.get('/profile', getProfile);

// PUT /api/users/profile
router.put('/profile', validate(updateProfileSchema), updateProfile);

// GET /api/users/recent-searches
router.get('/recent-searches', getRecentSearches);

// DELETE /api/users/recent-searches
router.delete('/recent-searches', clearRecentSearches);

module.exports = router;
