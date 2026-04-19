const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

/**
 * Stricter limiter for auth endpoints
 * 10 requests per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login/register attempts, please try again after 15 minutes',
  },
});

module.exports = { apiLimiter, authLimiter };
