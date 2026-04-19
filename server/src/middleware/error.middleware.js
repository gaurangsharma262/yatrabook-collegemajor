const ApiError = require('../utils/ApiError');
const env = require('../config/env');

/**
 * Global error handling middleware
 * Catches all errors and returns standardized JSON response
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // If it's not an ApiError, convert it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = ApiError.badRequest('Validation Error', messages);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = ApiError.conflict(`Duplicate value for ${field}. This ${field} already exists.`);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token has expired');
  }

  const response = {
    success: false,
    message: error.message,
    ...(error.errors.length > 0 && { errors: error.errors }),
    ...(env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  console.error(`❌ [${error.statusCode}] ${error.message}`);
  if (env.NODE_ENV === 'development') {
    console.error(error.stack);
  }

  res.status(error.statusCode).json(response);
};

/**
 * 404 handler for unknown routes
 */
const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = { errorHandler, notFoundHandler };
