const crypto = require('crypto');

/**
 * Generate a unique booking ID
 * Format: TBP-YYYYMMDD-XXXXX
 */
const generateBookingId = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 5);
  return `TBP-${dateStr}-${random}`;
};

/**
 * Generate a PNR number
 * Format: 10-digit number
 */
const generatePNR = () => {
  const prefix = Math.floor(Math.random() * 9) + 1; // 1-9
  const rest = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  return `${prefix}${rest}`;
};

/**
 * Calculate duration in minutes from time strings
 * @param {string} departure - "HH:mm"
 * @param {string} arrival - "HH:mm"
 * @param {boolean} nextDay - if arrival is next day
 */
const calculateDuration = (departure, arrival, nextDay = false) => {
  const [depH, depM] = departure.split(':').map(Number);
  const [arrH, arrM] = arrival.split(':').map(Number);
  
  let depMinutes = depH * 60 + depM;
  let arrMinutes = arrH * 60 + arrM;
  
  if (nextDay || arrMinutes < depMinutes) {
    arrMinutes += 24 * 60;
  }
  
  return arrMinutes - depMinutes;
};

/**
 * Format duration minutes to "Xh Ym" string
 */
const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

/**
 * Paginate results
 */
const paginate = (page = 1, limit = 10) => {
  const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
  return { skip, limit: parseInt(limit) };
};

/**
 * Build sort object from query string
 * @param {string} sortBy - "price_asc", "duration_asc", "departure_asc"
 */
const buildSortQuery = (sortBy) => {
  const sortMap = {
    price_asc: { 'classes.0.price': 1 },
    price_desc: { 'classes.0.price': -1 },
    duration_asc: { durationMinutes: 1 },
    duration_desc: { durationMinutes: -1 },
    departure_asc: { departure: 1 },
    departure_desc: { departure: -1 },
    rating_desc: { rating: -1 },
  };
  return sortMap[sortBy] || { rating: -1 }; // Default: recommended (by rating)
};

module.exports = {
  generateBookingId,
  generatePNR,
  calculateDuration,
  formatDuration,
  paginate,
  buildSortQuery,
};
