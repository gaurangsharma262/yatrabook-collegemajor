const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().trim()
    .messages({ 'string.empty': 'Name is required' }),
  email: Joi.string().email().required().lowercase().trim()
    .messages({ 'string.email': 'Please provide a valid email' }),
  password: Joi.string().min(6).max(128).required()
    .messages({ 'string.min': 'Password must be at least 6 characters' }),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional()
    .messages({ 'string.pattern.base': 'Please provide a valid Indian phone number' }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().optional(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional().allow(''),
  avatar: Joi.string().uri().optional().allow(''),
});

module.exports = { registerSchema, loginSchema, updateProfileSchema };
