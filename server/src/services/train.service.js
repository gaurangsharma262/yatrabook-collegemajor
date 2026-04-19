const Train = require('../models/Train');
const ApiError = require('../utils/ApiError');
const { paginate, buildSortQuery } = require('../utils/helpers');

/**
 * Search trains by source and destination
 */
const searchTrains = async (query) => {
  const { from, to, sort, class: classType, minPrice, maxPrice, maxDuration, departure, page, limit } = query;
  const { skip, limit: lim } = paginate(page, limit);

  // Build filter
  const filter = {
    isActive: true,
    $or: [
      { 'source.city': { $regex: new RegExp(from, 'i') } },
      { 'source.code': { $regex: new RegExp(from, 'i') } },
    ],
  };

  // Destination filter
  filter.$and = [
    {
      $or: [
        { 'destination.city': { $regex: new RegExp(to, 'i') } },
        { 'destination.code': { $regex: new RegExp(to, 'i') } },
      ],
    },
  ];

  // Class filter
  if (classType) {
    filter['classes.type'] = classType.toUpperCase();
  }

  // Price filter
  if (minPrice || maxPrice) {
    filter['classes.price'] = {};
    if (minPrice) filter['classes.price'].$gte = parseInt(minPrice);
    if (maxPrice) filter['classes.price'].$lte = parseInt(maxPrice);
  }

  // Duration filter
  if (maxDuration) {
    filter.durationMinutes = { $lte: parseInt(maxDuration) };
  }

  // Departure time filter
  if (departure) {
    const timeRanges = {
      morning: { $gte: '04:00', $lt: '12:00' },
      afternoon: { $gte: '12:00', $lt: '17:00' },
      evening: { $gte: '17:00', $lt: '21:00' },
      night: { $or: [{ $gte: '21:00' }, { $lt: '04:00' }] },
    };
    if (timeRanges[departure] && !timeRanges[departure].$or) {
      filter.departure = timeRanges[departure];
    }
  }

  const sortQuery = buildSortQuery(sort);

  const [trains, total] = await Promise.all([
    Train.find(filter).sort(sortQuery).skip(skip).limit(lim),
    Train.countDocuments(filter),
  ]);

  return {
    trains,
    pagination: {
      total,
      page: parseInt(page) || 1,
      limit: lim,
      pages: Math.ceil(total / lim),
    },
  };
};

/**
 * Get train by ID
 */
const getTrainById = async (trainId) => {
  const train = await Train.findOne({ trainId });
  if (!train) {
    throw ApiError.notFound('Train not found');
  }
  return train;
};

/**
 * Check availability for a specific class
 */
const checkAvailability = async (trainId, classType) => {
  const train = await Train.findOne({ trainId });
  if (!train) {
    throw ApiError.notFound('Train not found');
  }

  const classInfo = train.classes.find((c) => c.type === classType);
  if (!classInfo) {
    throw ApiError.notFound(`Class ${classType} not available on this train`);
  }

  return {
    trainId: train.trainId,
    trainName: train.name,
    class: classInfo,
    status: classInfo.availableSeats > 0
      ? 'available'
      : classInfo.waitlistCount < 20
        ? 'waitlist'
        : 'not_available',
  };
};

/**
 * Get all unique stations
 */
const getAllStations = async () => {
  const trains = await Train.find({ isActive: true }).select('source destination');
  const stationSet = new Map();

  trains.forEach((t) => {
    stationSet.set(t.source.code, { city: t.source.city, station: t.source.station, code: t.source.code });
    stationSet.set(t.destination.code, { city: t.destination.city, station: t.destination.station, code: t.destination.code });
  });

  return Array.from(stationSet.values()).sort((a, b) => a.city.localeCompare(b.city));
};

/**
 * Get popular routes (based on available trains)
 */
const getPopularRoutes = async () => {
  const routes = await Train.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: { source: '$source.city', destination: '$destination.city' },
        count: { $sum: 1 },
        minPrice: { $min: { $arrayElemAt: ['$classes.price', 0] } },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  return routes.map((r) => ({
    source: r._id.source,
    destination: r._id.destination,
    trainCount: r.count,
    startingPrice: r.minPrice,
  }));
};

module.exports = { searchTrains, getTrainById, checkAvailability, getAllStations, getPopularRoutes };
