const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['1A', '2A', '3A', 'SL', 'CC', '2S', 'EC'],
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 0,
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 0,
  },
  waitlistCount: {
    type: Number,
    default: 0,
    min: 0,
  },
}, { _id: false });

const stopSchema = new mongoose.Schema({
  station: { type: String, required: true },
  code: { type: String, required: true },
  arrival: { type: String },
  departure: { type: String },
  day: { type: Number, default: 1 },
}, { _id: false });

const trainSchema = new mongoose.Schema({
  trainId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    index: true,
  },
  trainNumber: {
    type: String,
    required: true,
  },
  source: {
    city: { type: String, required: true },
    station: { type: String, required: true },
    code: { type: String, required: true },
  },
  destination: {
    city: { type: String, required: true },
    station: { type: String, required: true },
    code: { type: String, required: true },
  },
  departure: {
    type: String,
    required: true,
  },
  arrival: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  durationMinutes: {
    type: Number,
    required: true,
    index: true,
  },
  runningDays: {
    type: [String],
    default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  stops: {
    type: [stopSchema],
    default: [],
  },
  classes: {
    type: [classSchema],
    required: true,
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5,
  },
  amenities: {
    type: [String],
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Compound indexes for search performance
trainSchema.index({ 'source.city': 1, 'destination.city': 1 });
trainSchema.index({ 'source.code': 1, 'destination.code': 1 });
trainSchema.index({ 'classes.price': 1 });

module.exports = mongoose.model('Train', trainSchema);
