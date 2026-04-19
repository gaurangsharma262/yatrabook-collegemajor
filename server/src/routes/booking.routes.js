const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getBookingById, cancelBooking } = require('../controllers/booking.controller');
const { auth } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createBookingSchema, cancelBookingSchema } = require('../validators/booking.validator');

// All routes require authentication
router.use(auth);

// POST /api/bookings
router.post('/', validate(createBookingSchema), createBooking);

// GET /api/bookings
router.get('/', getUserBookings);

// GET /api/bookings/:id
router.get('/:id', getBookingById);

// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', validate(cancelBookingSchema), cancelBooking);

module.exports = router;
