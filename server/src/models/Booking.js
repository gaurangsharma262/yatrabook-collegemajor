const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 1, max: 120 },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  seatNumber: { type: String, default: '' },
  status: {
    type: String,
    enum: ['confirmed', 'waitlisted', 'cancelled'],
    default: 'confirmed',
  },
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['train', 'flight', 'bus'],
    required: true,
  },
  travelId: {
    type: String,
    required: true, // trainId / flightId / busId
  },
  travelName: {
    type: String,
    required: true,
  },
  travelNumber: {
    type: String,
    default: '',
  },
  source: {
    city: { type: String, required: true },
    name: { type: String, default: '' }, // station/airport/terminal name
    code: { type: String, default: '' },
  },
  destination: {
    city: { type: String, required: true },
    name: { type: String, default: '' },
    code: { type: String, default: '' },
  },
  travelDate: {
    type: Date,
    required: true,
  },
  departure: { type: String, required: true },
  arrival: { type: String, required: true },
  duration: { type: String, default: '' },
  passengers: {
    type: [passengerSchema],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length >= 1 && arr.length <= 6;
      },
      message: 'Passengers must be between 1 and 6',
    },
  },
  class: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: '',
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentStatus: {
    type: String,
    enum: ['success', 'pending', 'failed'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'netbanking', 'wallet'],
    default: 'upi',
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'waitlisted', 'cancelled'],
    default: 'confirmed',
  },
  pnr: {
    type: String,
    required: true,
    index: true,
  },
  cancellationReason: {
    type: String,
    default: '',
  },
  cancelledAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Index for user booking history queries
bookingSchema.index({ userId: 1, createdAt: -1 });
// pnr index already defined via index:true in schema

module.exports = mongoose.model('Booking', bookingSchema);
