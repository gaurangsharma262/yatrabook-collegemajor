const Joi = require('joi');

const searchSchema = Joi.object({
  from: Joi.string().required().trim()
    .messages({ 'string.empty': 'Source city is required' }),
  to: Joi.string().required().trim()
    .messages({ 'string.empty': 'Destination city is required' }),
  date: Joi.date().iso().optional(),
  sort: Joi.string().valid(
    'price_asc', 'price_desc',
    'duration_asc', 'duration_desc',
    'departure_asc', 'departure_desc',
    'rating_desc'
  ).default('rating_desc'),
  class: Joi.string().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  maxDuration: Joi.number().min(0).optional(), // in minutes
  departure: Joi.string().valid('morning', 'afternoon', 'evening', 'night').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
});

module.exports = { searchSchema };
