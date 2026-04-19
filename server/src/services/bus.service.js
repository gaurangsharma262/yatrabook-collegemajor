const Bus = require('../models/Bus');
const ApiError = require('../utils/ApiError');
const { paginate, buildSortQuery } = require('../utils/helpers');

/**
 * Search buses by source and destination
 */
const searchBuses = async (query) => {
  const { from, to, sort, class: classType, minPrice, maxPrice, maxDuration, departure, page, limit } = query;
  const { skip, limit: lim } = paginate(page, limit);

  const filter = {
    isActive: true,
    'source.city': { $regex: new RegExp(from, 'i') },
    'destination.city': { $regex: new RegExp(to, 'i') },
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

  const [buses, total] = await Promise.all([
    Bus.find(filter).sort(sortQuery).skip(skip).limit(lim),
    Bus.countDocuments(filter),
  ]);

  return {
    buses,
    pagination: {
      total,
      page: parseInt(page) || 1,
      limit: lim,
      pages: Math.ceil(total / lim),
    },
  };
};

/**
 * Get bus by ID
 */
const getBusById = async (busId) => {
  const bus = await Bus.findOne({ busId });
  if (!bus) {
    throw ApiError.notFound('Bus not found');
  }
  return bus;
};

/**
 * Get all operators
 */
const getAllOperators = async () => {
  const operators = await Bus.distinct('operator', { isActive: true });
  return operators.sort();
};

module.exports = { searchBuses, getBusById, getAllOperators };
