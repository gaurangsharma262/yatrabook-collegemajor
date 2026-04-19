const Flight = require('../models/Flight');
const ApiError = require('../utils/ApiError');
const { paginate, buildSortQuery } = require('../utils/helpers');

/**
 * Search flights by source and destination
 */
const searchFlights = async (query) => {
  const { from, to, sort, class: classType, minPrice, maxPrice, maxDuration, departure, page, limit } = query;
  const { skip, limit: lim } = paginate(page, limit);

  const filter = {
    isActive: true,
    $or: [
      { 'source.city': { $regex: new RegExp(from, 'i') } },
      { 'source.code': { $regex: new RegExp(from, 'i') } },
    ],
    $and: [
      {
        $or: [
          { 'destination.city': { $regex: new RegExp(to, 'i') } },
          { 'destination.code': { $regex: new RegExp(to, 'i') } },
        ],
      },
    ],
  };

  if (classType) {
    filter['classes.type'] = classType.toLowerCase();
  }
  if (minPrice || maxPrice) {
    filter['classes.price'] = {};
    if (minPrice) filter['classes.price'].$gte = parseInt(minPrice);
    if (maxPrice) filter['classes.price'].$lte = parseInt(maxPrice);
  }
  if (maxDuration) {
    filter.durationMinutes = { $lte: parseInt(maxDuration) };
  }

  const sortQuery = buildSortQuery(sort);

  const [flights, total] = await Promise.all([
    Flight.find(filter).sort(sortQuery).skip(skip).limit(lim),
    Flight.countDocuments(filter),
  ]);

  return {
    flights,
    pagination: {
      total,
      page: parseInt(page) || 1,
      limit: lim,
      pages: Math.ceil(total / lim),
    },
  };
};

/**
 * Get flight by ID
 */
const getFlightById = async (flightId) => {
  const flight = await Flight.findOne({ flightId });
  if (!flight) {
    throw ApiError.notFound('Flight not found');
  }
  return flight;
};

/**
 * Get all airports
 */
const getAllAirports = async () => {
  const flights = await Flight.find({ isActive: true }).select('source destination');
  const airportSet = new Map();

  flights.forEach((f) => {
    airportSet.set(f.source.code, { city: f.source.city, airport: f.source.airport, code: f.source.code });
    airportSet.set(f.destination.code, { city: f.destination.city, airport: f.destination.airport, code: f.destination.code });
  });

  return Array.from(airportSet.values()).sort((a, b) => a.city.localeCompare(b.city));
};

module.exports = { searchFlights, getFlightById, getAllAirports };
