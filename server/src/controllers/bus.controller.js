const busService = require('../services/bus.service');
const ApiResponse = require('../utils/ApiResponse');

const searchBuses = async (req, res, next) => {
  try {
    const result = await busService.searchBuses(req.query);

    if (req.user) {
      await req.user.addRecentSearch({
        type: 'bus',
        from: req.query.from,
        to: req.query.to,
        date: req.query.date,
      });
    }

    ApiResponse.ok(result, 'Buses found').send(res);
  } catch (error) {
    next(error);
  }
};

const getBusById = async (req, res, next) => {
  try {
    const bus = await busService.getBusById(req.params.id);
    ApiResponse.ok(bus, 'Bus details retrieved').send(res);
  } catch (error) {
    next(error);
  }
};

const getOperators = async (req, res, next) => {
  try {
    const operators = await busService.getAllOperators();
    ApiResponse.ok(operators, 'Operators retrieved').send(res);
  } catch (error) {
    next(error);
  }
};

module.exports = { searchBuses, getBusById, getOperators };
