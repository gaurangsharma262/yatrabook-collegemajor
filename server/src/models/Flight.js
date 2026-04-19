const mongoose = require('mongoose');

const flightClassSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['economy', 'premium_economy', 'business', 'first'],
  },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  totalSeats: { type: Number, required: true, min: 0 },
  availableSeats: { type: Number, required: true, min: 0 },
}, { _id: false });

const stopDetailSchema = new mongoose.Schema({
  airport: { type: String, required: true },
  code: { type: String, required: true },
  duration: { type: String }, // Layover duration
}, { _id: false });

const flightSchema = new mongoose.Schema({
  flightId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  airline: {
    type: String,
    required: true,
  },
  airlineLogo: {
    type: String,
    default: '',
  },
  flightNumber: {
    type: String,
    required: true,
  },
  source: {
    city: { type: String, required: true },
    airport: { type: String, required: true },
    code: { type: String, required: true },
  },
  destination: {
    city: { type: String, required: true },
    airport: { type: String, required: true },
    code: { type: String, required: true },
  },
  departure: { type: String, required: true },
  arrival: { type: String, required: true },
  duration: { type: String, required: true },
  durationMinutes: { type: Number, required: true, index: true },
  stops: {
    type: Number,
    default: 0, // 0 = non-stop
  },
  stopDetails: {
    type: [stopDetailSchema],
    default: [],
  },
  classes: {
    type: [flightClassSchema],
    required: true,
  },
  aircraft: {
    type: String,
    default: '',
  },
  amenities: {
    type: [String],
    default: [],
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5,
  },
  operatingDays: {
    type: [String],
    default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Search indexes
flightSchema.index({ 'source.city': 1, 'destination.city': 1 });
flightSchema.index({ 'source.code': 1, 'destination.code': 1 });
flightSchema.index({ 'classes.price': 1 });

module.exports = mongoose.model('Flight', flightSchema);
