const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

/**
 * JWT Authentication middleware
 * Verifies token and attaches user to request
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('Access denied. No token provided.');
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      throw ApiError.unauthorized('User not found. Token is invalid.');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(ApiError.unauthorized('Invalid or expired token'));
  }
};

/**
 * Optional auth - doesn't fail if no token, but attaches user if valid
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    }
  } catch (error) {
    // Silently continue without auth
  }
  next();
};

/**
 * Admin-only middleware
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  next(ApiError.forbidden('Admin access only'));
};

module.exports = { auth, optionalAuth, adminOnly };
