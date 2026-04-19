const trainService = require('../services/train.service');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/User');

const searchTrains = async (req, res, next) => {
  try {
    const result = await trainService.searchTrains(req.query);

    // Save to recent searches if user is authenticated
    if (req.user) {
      await req.user.addRecentSearch({
        type: 'train',
        from: req.query.from,
        to: req.query.to,
        date: req.query.date,
      });
    }

    ApiResponse.ok(result, 'Trains found').send(res);
  } catch (error) {
    next(error);
  }
};

const getTrainById = async (req, res, next) => {
  try {
    const train = await trainService.getTrainById(req.params.id);
    ApiResponse.ok(train, 'Train details retrieved').send(res);
  } catch (error) {
    next(error);
  }
};

const checkAvailability = async (req, res, next) => {
  try {
    const result = await trainService.checkAvailability(req.params.id, req.query.class);
    ApiResponse.ok(result, 'Availability checked').send(res);
  } catch (error) {
    next(error);
  }
};

const getStations = async (req, res, next) => {
  try {
    const stations = await trainService.getAllStations();
    ApiResponse.ok(stations, 'Stations retrieved').send(res);
  } catch (error) {
    next(error);
  }
};

const getPopularRoutes = async (req, res, next) => {
  try {
    const routes = await trainService.getPopularRoutes();
    ApiResponse.ok(routes, 'Popular routes retrieved').send(res);
  } catch (error) {
    next(error);
  }
};

module.exports = { searchTrains, getTrainById, checkAvailability, getStations, getPopularRoutes };
