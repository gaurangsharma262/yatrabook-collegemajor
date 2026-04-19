const Train = require('../models/Train');
const Flight = require('../models/Flight');
const Bus = require('../models/Bus');
const Booking = require('../models/Booking');
const ApiError = require('../utils/ApiError');
const { generateBookingId, generatePNR } = require('../utils/helpers');

/**
 * Get the transport model based on type
 */
const getModel = (type) => {
  const models = { train: Train, flight: Flight, bus: Bus };
  return models[type];
};

/**
 * Get the ID field based on type
 */
const getIdField = (type) => {
  const fields = { train: 'trainId', flight: 'flightId', bus: 'busId' };
  return fields[type];
};

/**
 * Create a new booking
 */
const createBooking = async (userId, bookingData) => {
  const { type, travelId, travelDate, class: classType, passengers, paymentMethod } = bookingData;

  // Get transport entity
  const Model = getModel(type);
  const idField = getIdField(type);
  const entity = await Model.findOne({ [idField]: travelId });

  if (!entity) {
    throw ApiError.notFound(`${type.charAt(0).toUpperCase() + type.slice(1)} not found`);
  }

  // Find the selected class
  const selectedClass = entity.classes.find((c) => c.type === classType);
  if (!selectedClass) {
    throw ApiError.badRequest(`Class ${classType} is not available`);
  }

  // Check availability and handle waitlist
  const passengerCount = passengers.length;
  let bookingStatus = 'confirmed';
  const processedPassengers = [];

  if (selectedClass.availableSeats >= passengerCount) {
    // Enough seats — confirm all
    selectedClass.availableSeats -= passengerCount;

    passengers.forEach((p, i) => {
      processedPassengers.push({
        ...p,
        seatNumber: `${classType}-${selectedClass.totalSeats - selectedClass.availableSeats - passengerCount + i + 1}`,
        status: 'confirmed',
      });
    });
  } else if (selectedClass.availableSeats > 0) {
    // Partial — some confirmed, rest waitlisted
    const confirmed = selectedClass.availableSeats;
    const waitlisted = passengerCount - confirmed;
    selectedClass.availableSeats = 0;
    selectedClass.waitlistCount = (selectedClass.waitlistCount || 0) + waitlisted;
    bookingStatus = 'waitlisted';

    passengers.forEach((p, i) => {
      processedPassengers.push({
        ...p,
        seatNumber: i < confirmed
          ? `${classType}-${selectedClass.totalSeats - confirmed + i + 1}`
          : `WL-${selectedClass.waitlistCount - waitlisted + (i - confirmed) + 1}`,
        status: i < confirmed ? 'confirmed' : 'waitlisted',
      });
    });
  } else {
    // No seats — all waitlisted
    selectedClass.waitlistCount = (selectedClass.waitlistCount || 0) + passengerCount;
    bookingStatus = 'waitlisted';

    passengers.forEach((p, i) => {
      processedPassengers.push({
        ...p,
        seatNumber: `WL-${selectedClass.waitlistCount - passengerCount + i + 1}`,
        status: 'waitlisted',
      });
    });
  }

  // Save updated seats
  await entity.save();

  // Calculate total amount
  const totalAmount = selectedClass.price * passengerCount;

  // Build source/destination info
  const sourceInfo = {
    city: entity.source.city,
    name: entity.source.station || entity.source.airport || entity.source.terminal || '',
    code: entity.source.code || '',
  };
  const destInfo = {
    city: entity.destination.city,
    name: entity.destination.station || entity.destination.airport || entity.destination.terminal || '',
    code: entity.destination.code || '',
  };

  // Create booking
  const booking = await Booking.create({
    bookingId: generateBookingId(),
    userId,
    type,
    travelId,
    travelName: entity.name || entity.operator || entity.airline,
    travelNumber: entity.trainNumber || entity.flightNumber || entity.busId,
    source: sourceInfo,
    destination: destInfo,
    travelDate,
    departure: entity.departure,
    arrival: entity.arrival,
    duration: entity.duration,
    passengers: processedPassengers,
    class: classType,
    className: selectedClass.name,
    totalAmount,
    paymentStatus: 'success', // Simulated payment
    paymentMethod: paymentMethod || 'upi',
    bookingStatus,
    pnr: generatePNR(),
  });

  return booking;
};

/**
 * Get all bookings for a user
 */
const getUserBookings = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    Booking.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Booking.countDocuments({ userId }),
  ]);

  return {
    bookings,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get booking by ID
 */
const getBookingById = async (bookingId, userId) => {
  const booking = await Booking.findOne({ bookingId, userId });
  if (!booking) {
    throw ApiError.notFound('Booking not found');
  }
  return booking;
};

/**
 * Cancel booking
 */
const cancelBooking = async (bookingId, userId, reason) => {
  const booking = await Booking.findOne({ bookingId, userId });
  if (!booking) {
    throw ApiError.notFound('Booking not found');
  }

  if (booking.bookingStatus === 'cancelled') {
    throw ApiError.badRequest('Booking is already cancelled');
  }

  // Restore seats
  const Model = getModel(booking.type);
  const idField = getIdField(booking.type);
  const entity = await Model.findOne({ [idField]: booking.travelId });

  if (entity) {
    const classInfo = entity.classes.find((c) => c.type === booking.class);
    if (classInfo) {
      const confirmedCount = booking.passengers.filter((p) => p.status === 'confirmed').length;
      const waitlistedCount = booking.passengers.filter((p) => p.status === 'waitlisted').length;
      classInfo.availableSeats += confirmedCount;
      classInfo.waitlistCount = Math.max(0, (classInfo.waitlistCount || 0) - waitlistedCount);
      await entity.save();
    }
  }

  // Update booking
  booking.bookingStatus = 'cancelled';
  booking.paymentStatus = 'failed';
  booking.cancellationReason = reason || 'Cancelled by user';
  booking.cancelledAt = new Date();
  booking.passengers.forEach((p) => { p.status = 'cancelled'; });
  await booking.save();

  return booking;
};

module.exports = { createBooking, getUserBookings, getBookingById, cancelBooking };
