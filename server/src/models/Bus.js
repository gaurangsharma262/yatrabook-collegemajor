const mongoose = require('mongoose');

const busClassSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['seater', 'sleeper', 'semi_sleeper'],
  },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  totalSeats: { type: Number, required: true, min: 0 },
  availableSeats: { type: Number, required: true, min: 0 },
}, { _id: false });

const busSchema = new mongoose.Schema({
  busId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  operator: {
    type: String,
    required: true,
  },
  busType: {
    type: String,
    required: true,
  },
  source: {
    city: { type: String, required: true },
    terminal: { type: String, default: '' },
  },
  destination: {
    city: { type: String, required: true },
    terminal: { type: String, default: '' },
  },
  departure: { type: String, required: true },
  arrival: { type: String, required: true },
  duration: { type: String, required: true },
  durationMinutes: { type: Number, required: true, index: true },
  classes: {
    type: [busClassSchema],
    required: true,
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
  boardingPoints: {
    type: [String],
    default: [],
  },
  droppingPoints: {
    type: [String],
    default: [],
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
busSchema.index({ 'source.city': 1, 'destination.city': 1 });
busSchema.index({ 'classes.price': 1 });

module.exports = mongoose.model('Bus', busSchema);
