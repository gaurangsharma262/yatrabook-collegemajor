const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Register a new user
 */
const register = async ({ name, email, password, phone }) => {
  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('An account with this email already exists');
  }

  // Create user
  const user = await User.create({ name, email, password, phone });
  const token = generateToken(user._id);

  return {
    user: user.toJSON(),
    token,
  };
};

/**
 * Login user
 */
const login = async ({ email, password }) => {
  // Find user with password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = generateToken(user._id);

  return {
    user: user.toJSON(),
    token,
  };
};

/**
 * Get current user profile
 */
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return user;
};

module.exports = { register, login, getCurrentUser, generateToken };
