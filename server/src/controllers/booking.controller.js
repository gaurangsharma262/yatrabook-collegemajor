const bookingService = require('../services/booking.service');
const ApiResponse = require('../utils/ApiResponse');

const createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.user._id, req.body);
    ApiResponse.created(booking, 'Booking created successfully').send(res);
  } catch (error) {
    next(error);
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await bookingService.getUserBookings(req.user._id, page, limit);
    ApiResponse.ok(result, 'Bookings retrieved').send(res);
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id, req.user._id);
    ApiResponse.ok(booking, 'Booking details retrieved').send(res);
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.cancelBooking(
      req.params.id,
      req.user._id,
      req.body.reason
    );
    ApiResponse.ok(booking, 'Booking cancelled successfully').send(res);
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getUserBookings, getBookingById, cancelBooking };
