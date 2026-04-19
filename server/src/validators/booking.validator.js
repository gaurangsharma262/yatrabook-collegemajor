const Joi = require('joi');

const createBookingSchema = Joi.object({
  type: Joi.string().valid('train', 'flight', 'bus').required(),
  travelId: Joi.string().required(),
  travelDate: Joi.date().iso().min('now').required()
    .messages({ 'date.min': 'Travel date must be in the future' }),
  class: Joi.string().required(),
  passengers: Joi.array().items(
    Joi.object({
      name: Joi.string().min(2).max(50).required(),
      age: Joi.number().integer().min(1).max(120).required(),
      gender: Joi.string().valid('male', 'female', 'other').required(),
    })
  ).min(1).max(6).required()
    .messages({
      'array.min': 'At least 1 passenger is required',
      'array.max': 'Maximum 6 passengers allowed',
    }),
  paymentMethod: Joi.string().valid('upi', 'card', 'netbanking', 'wallet').default('upi'),
});

const cancelBookingSchema = Joi.object({
  reason: Joi.string().max(200).optional().default('Cancelled by user'),
});

module.exports = { createBookingSchema, cancelBookingSchema };
