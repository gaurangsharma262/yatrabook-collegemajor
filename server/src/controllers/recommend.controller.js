const recommendationService = require('../services/recommendation.service');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const getCheapest = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      throw ApiError.badRequest('Both "from" and "to" query parameters are required');
    }
    const results = await recommendationService.getCheapest(from, to);
    ApiResponse.ok(results, 'Cheapest options found').send(res);
  } catch (error) {
    next(error);
  }
};

const getFastest = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      throw ApiError.badRequest('Both "from" and "to" query parameters are required');
    }
    const results = await recommendationService.getFastest(from, to);
    ApiResponse.ok(results, 'Fastest options found').send(res);
  } catch (error) {
    next(error);
  }
};

const planMultiCity = async (req, res, next) => {
  try {
    const { cities } = req.body;
    if (!cities || !Array.isArray(cities) || cities.length < 2) {
      throw ApiError.badRequest('Please provide at least 2 cities in the "cities" array');
    }
    const result = await recommendationService.planMultiCity(cities);
    ApiResponse.ok(result, 'Multi-city trip planned').send(res);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCheapest, getFastest, planMultiCity };
