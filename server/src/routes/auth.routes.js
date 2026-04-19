const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const { authLimiter } = require('../middleware/rateLimiter.middleware');

// POST /api/auth/register
router.post('/register', authLimiter, validate(registerSchema), register);

// POST /api/auth/login
router.post('/login', authLimiter, validate(loginSchema), login);

// POST /api/auth/logout
router.post('/logout', auth, logout);

// GET /api/auth/me
router.get('/me', auth, getMe);

module.exports = router;
