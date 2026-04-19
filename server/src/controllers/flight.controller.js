const flightService = require('../services/flight.service');
const ApiResponse = require('../utils/ApiResponse');

const searchFlights = async (req, res, next) => {
  try {
    const result = await flightService.searchFlights(req.query);

    if (req.user) {
      await req.user.addRecentSearch({
        type: 'flight',
        from: req.query.from,
        to: req.query.to,
        date: req.query.date,
      });
    }

    ApiResponse.ok(result, 'Flights found').send(res);
  } catch (error) {
    next(error);
  }
};

const getFlightById = async (req, res, next) => {
  try {
    const flight = await flightService.getFlightById(req.params.id);
    ApiResponse.ok(flight, 'Flight details retrieved').send(res);
  } catch (error) {
    next(error);
  }
};

const getAirports = async (req, res, next) => {
  try {
    const airports = await flightService.getAllAirports();
    ApiResponse.ok(airports, 'Airports retrieved').send(res);
  } catch (error) {
    next(error);
  }
};

module.exports = { searchFlights, getFlightById, getAirports };
