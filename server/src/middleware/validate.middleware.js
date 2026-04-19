const ApiError = require('../utils/ApiError');

/**
 * Validation middleware factory
 * @param {Joi.Schema} schema - Joi schema to validate against
 * @param {string} property - 'body', 'query', or 'params'
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((d) => d.message);
      return next(ApiError.badRequest('Validation Error', messages));
    }

    // Replace with validated/sanitized values
    req[property] = value;
    next();
  };
};

module.exports = validate;
