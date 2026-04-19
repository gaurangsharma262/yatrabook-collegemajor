const Train = require('../models/Train');
const Flight = require('../models/Flight');
const Bus = require('../models/Bus');

/**
 * Get cheapest option across all transport modes
 */
const getCheapest = async (from, to) => {
  const regex = (city) => ({ $regex: new RegExp(city, 'i') });

  const [trains, flights, buses] = await Promise.all([
    Train.find({
      'source.city': regex(from),
      'destination.city': regex(to),
      isActive: true,
    }).sort({ 'classes.0.price': 1 }).limit(3),
    Flight.find({
      'source.city': regex(from),
      'destination.city': regex(to),
      isActive: true,
    }).sort({ 'classes.0.price': 1 }).limit(3),
    Bus.find({
      'source.city': regex(from),
      'destination.city': regex(to),
      isActive: true,
    }).sort({ 'classes.0.price': 1 }).limit(3),
  ]);

  const results = [];

  trains.forEach((t) => {
    const cheapestClass = t.classes.reduce((min, c) => c.price < min.price ? c : min, t.classes[0]);
    results.push({
      type: 'train',
      id: t.trainId,
      name: t.name,
      number: t.trainNumber,
      source: t.source.city,
      destination: t.destination.city,
      departure: t.departure,
      arrival: t.arrival,
      duration: t.duration,
      durationMinutes: t.durationMinutes,
      price: cheapestClass.price,
      class: cheapestClass.name,
    });
  });

  flights.forEach((f) => {
    const cheapestClass = f.classes.reduce((min, c) => c.price < min.price ? c : min, f.classes[0]);
    results.push({
      type: 'flight',
      id: f.flightId,
      name: f.airline,
      number: f.flightNumber,
      source: f.source.city,
      destination: f.destination.city,
      departure: f.departure,
      arrival: f.arrival,
      duration: f.duration,
      durationMinutes: f.durationMinutes,
      price: cheapestClass.price,
      class: cheapestClass.name,
    });
  });

  buses.forEach((b) => {
    const cheapestClass = b.classes.reduce((min, c) => c.price < min.price ? c : min, b.classes[0]);
    results.push({
      type: 'bus',
      id: b.busId,
      name: b.operator,
      number: b.busId,
      source: b.source.city,
      destination: b.destination.city,
      departure: b.departure,
      arrival: b.arrival,
      duration: b.duration,
      durationMinutes: b.durationMinutes,
      price: cheapestClass.price,
      class: cheapestClass.name,
    });
  });

  return results.sort((a, b) => a.price - b.price);
};

/**
 * Get fastest option across all transport modes
 */
const getFastest = async (from, to) => {
  const regex = (city) => ({ $regex: new RegExp(city, 'i') });

  const [trains, flights, buses] = await Promise.all([
    Train.find({
      'source.city': regex(from),
      'destination.city': regex(to),
      isActive: true,
    }).sort({ durationMinutes: 1 }).limit(3),
    Flight.find({
      'source.city': regex(from),
      'destination.city': regex(to),
      isActive: true,
    }).sort({ durationMinutes: 1 }).limit(3),
    Bus.find({
      'source.city': regex(from),
      'destination.city': regex(to),
      isActive: true,
    }).sort({ durationMinutes: 1 }).limit(3),
  ]);

  const results = [];
  const addResults = (items, type) => {
    items.forEach((item) => {
      const cheapestClass = item.classes.reduce((min, c) => c.price < min.price ? c : min, item.classes[0]);
      results.push({
        type,
        id: item[type + 'Id'] || item.busId || item.flightId || item.trainId,
        name: item.name || item.airline || item.operator,
        source: item.source.city,
        destination: item.destination.city,
        departure: item.departure,
        arrival: item.arrival,
        duration: item.duration,
        durationMinutes: item.durationMinutes,
        price: cheapestClass.price,
        class: cheapestClass.name,
      });
    });
  };

  addResults(trains, 'train');
  addResults(flights, 'flight');
  addResults(buses, 'bus');

  return results.sort((a, b) => a.durationMinutes - b.durationMinutes);
};

/**
 * Multi-city trip planner
 * Given an array of cities, find best connections between each pair
 */
const planMultiCity = async (cities) => {
  if (!cities || cities.length < 2) {
    return { segments: [], totalPrice: 0, totalDuration: 0 };
  }

  const segments = [];
  let totalPrice = 0;
  let totalDuration = 0;

  for (let i = 0; i < cities.length - 1; i++) {
    const from = cities[i];
    const to = cities[i + 1];

    // Get cheapest option for this segment
    const options = await getCheapest(from, to);

    if (options.length > 0) {
      const best = options[0];
      segments.push({
        from,
        to,
        recommendation: best,
        alternatives: options.slice(1, 3),
      });
      totalPrice += best.price;
      totalDuration += best.durationMinutes;
    } else {
      segments.push({
        from,
        to,
        recommendation: null,
        alternatives: [],
        message: `No direct transport found from ${from} to ${to}`,
      });
    }
  }

  return { segments, totalPrice, totalDuration, cities };
};

module.exports = { getCheapest, getFastest, planMultiCity };
