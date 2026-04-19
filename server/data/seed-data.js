/**
 * Seed Data Module
 * Provides data generation functions for in-memory DB auto-seeding
 * Also used by the main seed.js script as fallback
 */

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function generateFallbackTrains() {
  const trainData = [
    { id: '12301', name: 'Howrah Rajdhani Express', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Kolkata', toStn: 'Howrah Junction', toCode: 'HWH', dep: '16:50', arr: '09:55', dur: 1025, dist: 1453 },
    { id: '12302', name: 'New Delhi Rajdhani Express', from: 'Kolkata', fromStn: 'Howrah Junction', fromCode: 'HWH', to: 'Delhi', toStn: 'New Delhi', toCode: 'NDLS', dep: '14:05', arr: '10:05', dur: 1200, dist: 1453 },
    { id: '12951', name: 'Mumbai Rajdhani Express', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Mumbai', toStn: 'Mumbai Central', toCode: 'MMCT', dep: '16:25', arr: '08:15', dur: 950, dist: 1384 },
    { id: '12952', name: 'Delhi Rajdhani Express', from: 'Mumbai', fromStn: 'Mumbai Central', fromCode: 'MMCT', to: 'Delhi', toStn: 'New Delhi', toCode: 'NDLS', dep: '17:40', arr: '08:35', dur: 895, dist: 1384 },
    { id: '12259', name: 'Sealdah Duronto Express', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Kolkata', toStn: 'Sealdah', toCode: 'SDAH', dep: '20:05', arr: '12:55', dur: 1010, dist: 1453 },
    { id: '12001', name: 'Bhopal Shatabdi Express', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Bhopal', toStn: 'Bhopal Junction', toCode: 'BPL', dep: '06:00', arr: '14:35', dur: 515, dist: 707 },
    { id: '12002', name: 'Bhopal Shatabdi Express', from: 'Bhopal', fromStn: 'Bhopal Junction', fromCode: 'BPL', to: 'Delhi', toStn: 'New Delhi', toCode: 'NDLS', dep: '15:30', arr: '23:25', dur: 475, dist: 707 },
    { id: '12627', name: 'Karnataka Express', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Bangalore', toStn: 'KSR Bengaluru', toCode: 'SBC', dep: '21:20', arr: '06:40', dur: 2000, dist: 2444 },
    { id: '12621', name: 'Tamil Nadu Express', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Chennai', toStn: 'Chennai Central', toCode: 'MAS', dep: '22:30', arr: '07:10', dur: 1960, dist: 2182 },
    { id: '12431', name: 'Trivandrum Rajdhani Express', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Trivandrum', toStn: 'Trivandrum Central', toCode: 'TVC', dep: '11:25', arr: '18:55', dur: 1890, dist: 3149 },
    { id: '12309', name: 'Patna Rajdhani Express', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Patna', toStn: 'Rajendra Nagar Terminal', toCode: 'RJPB', dep: '16:50', arr: '05:15', dur: 745, dist: 1001 },
    { id: '12305', name: 'Howrah Rajdhani Express', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Kolkata', toStn: 'Howrah Junction', toCode: 'HWH', dep: '16:55', arr: '09:50', dur: 1015, dist: 1453 },
    { id: '12049', name: 'Gatimaan Express', from: 'Delhi', fromStn: 'Hazrat Nizamuddin', fromCode: 'NZM', to: 'Agra', toStn: 'Agra Cantt', toCode: 'AGC', dep: '08:10', arr: '09:50', dur: 100, dist: 188 },
    { id: '12050', name: 'Gatimaan Express', from: 'Agra', fromStn: 'Agra Cantt', fromCode: 'AGC', to: 'Delhi', toStn: 'Hazrat Nizamuddin', toCode: 'NZM', dep: '17:50', arr: '19:30', dur: 100, dist: 188 },
    { id: '12953', name: 'August Kranti Rajdhani Express', from: 'Mumbai', fromStn: 'Mumbai Central', fromCode: 'MMCT', to: 'Delhi', toStn: 'Hazrat Nizamuddin', toCode: 'NZM', dep: '17:35', arr: '10:55', dur: 1040, dist: 1384 },
    { id: '12625', name: 'Kerala Express', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Trivandrum', toStn: 'Trivandrum Central', toCode: 'TVC', dep: '11:25', arr: '18:55', dur: 1890, dist: 3149 },
    { id: '12839', name: 'Chennai Mail', from: 'Mumbai', fromStn: 'CSMT Mumbai', fromCode: 'CSMT', to: 'Chennai', toStn: 'Chennai Central', toCode: 'MAS', dep: '21:00', arr: '18:45', dur: 1305, dist: 1279 },
    { id: '12723', name: 'Telangana Express', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Hyderabad', toStn: 'Secunderabad Junction', toCode: 'SC', dep: '06:50', arr: '05:50', dur: 1380, dist: 1658 },
    { id: '22691', name: 'Bangalore Rajdhani Express', from: 'Delhi', fromStn: 'Hazrat Nizamuddin', fromCode: 'NZM', to: 'Bangalore', toStn: 'KSR Bengaluru', toCode: 'SBC', dep: '20:50', arr: '06:40', dur: 2030, dist: 2444 },
    { id: '12903', name: 'Golden Temple Mail', from: 'Mumbai', fromStn: 'CSMT Mumbai', fromCode: 'CSMT', to: 'Amritsar', toStn: 'Amritsar Junction', toCode: 'ASR', dep: '21:30', arr: '05:15', dur: 1905, dist: 1946 },
    { id: '12137', name: 'Punjab Mail', from: 'Mumbai', fromStn: 'CSMT Mumbai', fromCode: 'CSMT', to: 'Delhi', toStn: 'New Delhi', toCode: 'NDLS', dep: '19:10', arr: '19:00', dur: 1430, dist: 1384 },
    { id: '12615', name: 'Grand Trunk Express', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Chennai', toStn: 'Chennai Central', toCode: 'MAS', dep: '18:40', arr: '01:00', dur: 1940, dist: 2182 },
    { id: '12269', name: 'Duronto Express', from: 'Chennai', fromStn: 'Chennai Central', fromCode: 'MAS', to: 'Bangalore', toStn: 'KSR Bengaluru', toCode: 'SBC', dep: '23:00', arr: '04:40', dur: 340, dist: 350 },
    { id: '12657', name: 'Chennai Mail', from: 'Bangalore', fromStn: 'KSR Bengaluru', fromCode: 'SBC', to: 'Chennai', toStn: 'Chennai Central', toCode: 'MAS', dep: '22:00', arr: '04:40', dur: 400, dist: 350 },
    { id: '12859', name: 'Gitanjali Express', from: 'Mumbai', fromStn: 'CSMT Mumbai', fromCode: 'CSMT', to: 'Kolkata', toStn: 'Howrah Junction', toCode: 'HWH', dep: '06:00', arr: '10:30', dur: 1710, dist: 1968 },
    { id: '12129', name: 'Azad Hind Express', from: 'Pune', fromStn: 'Pune Junction', fromCode: 'PUNE', to: 'Kolkata', toStn: 'Howrah Junction', toCode: 'HWH', dep: '09:30', arr: '20:00', dur: 2070, dist: 1930 },
    { id: '16527', name: 'Bangalore Express', from: 'Bangalore', fromStn: 'KSR Bengaluru', fromCode: 'SBC', to: 'Hyderabad', toStn: 'Kacheguda', toCode: 'KCG', dep: '18:30', arr: '06:30', dur: 720, dist: 570 },
    { id: '12785', name: 'Bangalore Express', from: 'Hyderabad', fromStn: 'Secunderabad Junction', fromCode: 'SC', to: 'Bangalore', toStn: 'KSR Bengaluru', toCode: 'SBC', dep: '16:00', arr: '04:00', dur: 720, dist: 570 },
    { id: '12617', name: 'Mangala Lakshadweep Express', from: 'Delhi', fromStn: 'Hazrat Nizamuddin', fromCode: 'NZM', to: 'Mangalore', toStn: 'Mangalore Central', toCode: 'MAQ', dep: '08:15', arr: '20:10', dur: 2155, dist: 2646 },
    { id: '22109', name: 'Mumbai LTT Express', from: 'Mumbai', fromStn: 'Lokmanya Tilak Terminus', fromCode: 'LTT', to: 'Pune', toStn: 'Pune Junction', toCode: 'PUNE', dep: '07:10', arr: '10:30', dur: 200, dist: 192 },
  ];

  return trainData.map(t => ({
    trainId: t.id, name: t.name, trainNumber: t.id,
    source: { city: t.from, station: t.fromStn, code: t.fromCode },
    destination: { city: t.to, station: t.toStn, code: t.toCode },
    departure: t.dep, arrival: t.arr, duration: formatDuration(t.dur), durationMinutes: t.dur,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: [], classes: [
      { type: '1A', name: 'First AC', price: Math.round(t.dist * 4), totalSeats: 24, availableSeats: Math.floor(Math.random() * 14) + 6, waitlistCount: 0 },
      { type: '2A', name: 'Second AC', price: Math.round(t.dist * 2.5), totalSeats: 54, availableSeats: Math.floor(Math.random() * 30) + 10, waitlistCount: 0 },
      { type: '3A', name: 'Third AC', price: Math.round(t.dist * 1.8), totalSeats: 72, availableSeats: Math.floor(Math.random() * 40) + 15, waitlistCount: 0 },
      { type: 'SL', name: 'Sleeper', price: Math.round(t.dist * 0.7), totalSeats: 120, availableSeats: Math.floor(Math.random() * 60) + 20, waitlistCount: 0 },
    ],
    rating: +(3.5 + Math.random() * 1.5).toFixed(1), amenities: ['Pantry Car', 'Charging Point', 'WiFi', 'Bedding'], isActive: true,
  }));
}

function generateFallbackFlights() {
  const routes = [
    { airline: 'Air India', fn: '101', from: 'Delhi', to: 'Mumbai', dep: '06:00', arr: '08:15', dur: 135 },
    { airline: 'IndiGo', fn: '201', from: 'Delhi', to: 'Bangalore', dep: '07:30', arr: '10:15', dur: 165 },
    { airline: 'SpiceJet', fn: '301', from: 'Mumbai', to: 'Chennai', dep: '09:00', arr: '11:00', dur: 120 },
    { airline: 'Vistara', fn: '401', from: 'Delhi', to: 'Kolkata', dep: '08:00', arr: '10:30', dur: 150 },
    { airline: 'Air India', fn: '501', from: 'Bangalore', to: 'Delhi', dep: '11:00', arr: '14:00', dur: 180 },
    { airline: 'IndiGo', fn: '601', from: 'Mumbai', to: 'Delhi', dep: '06:30', arr: '08:45', dur: 135 },
    { airline: 'Vistara', fn: '701', from: 'Chennai', to: 'Delhi', dep: '08:00', arr: '10:40', dur: 160 },
    { airline: 'SpiceJet', fn: '801', from: 'Kolkata', to: 'Mumbai', dep: '10:00', arr: '12:45', dur: 165 },
    { airline: 'IndiGo', fn: '901', from: 'Hyderabad', to: 'Delhi', dep: '07:00', arr: '09:30', dur: 150 },
    { airline: 'Air India', fn: '102', from: 'Delhi', to: 'Goa', dep: '12:00', arr: '14:30', dur: 150 },
    { airline: 'Vistara', fn: '402', from: 'Mumbai', to: 'Bangalore', dep: '14:00', arr: '15:45', dur: 105 },
    { airline: 'IndiGo', fn: '202', from: 'Bangalore', to: 'Mumbai', dep: '16:00', arr: '17:50', dur: 110 },
    { airline: 'SpiceJet', fn: '302', from: 'Delhi', to: 'Hyderabad', dep: '13:00', arr: '15:30', dur: 150 },
    { airline: 'Air India', fn: '103', from: 'Kolkata', to: 'Delhi', dep: '09:00', arr: '11:30', dur: 150 },
    { airline: 'IndiGo', fn: '203', from: 'Chennai', to: 'Mumbai', dep: '10:30', arr: '12:30', dur: 120 },
    { airline: 'Vistara', fn: '403', from: 'Delhi', to: 'Chennai', dep: '15:00', arr: '17:40', dur: 160 },
    { airline: 'Air India', fn: '104', from: 'Mumbai', to: 'Kolkata', dep: '11:00', arr: '13:40', dur: 160 },
    { airline: 'IndiGo', fn: '204', from: 'Bangalore', to: 'Chennai', dep: '17:00', arr: '17:50', dur: 50 },
    { airline: 'SpiceJet', fn: '303', from: 'Hyderabad', to: 'Mumbai', dep: '08:30', arr: '10:00', dur: 90 },
    { airline: 'Vistara', fn: '404', from: 'Goa', to: 'Delhi', dep: '16:00', arr: '18:30', dur: 150 },
    { airline: 'IndiGo', fn: '205', from: 'Delhi', to: 'Pune', dep: '09:00', arr: '11:15', dur: 135 },
    { airline: 'Air India', fn: '105', from: 'Pune', to: 'Delhi', dep: '14:00', arr: '16:15', dur: 135 },
    { airline: 'IndiGo', fn: '206', from: 'Mumbai', to: 'Hyderabad', dep: '07:30', arr: '09:00', dur: 90 },
    { airline: 'SpiceJet', fn: '304', from: 'Bangalore', to: 'Kolkata', dep: '12:00', arr: '14:30', dur: 150 },
    { airline: 'Vistara', fn: '405', from: 'Kolkata', to: 'Bangalore', dep: '15:00', arr: '17:30', dur: 150 },
  ];

  const airportMap = {
    'Delhi': { airport: 'Indira Gandhi International Airport', code: 'DEL' },
    'Mumbai': { airport: 'Chhatrapati Shivaji Maharaj International Airport', code: 'BOM' },
    'Bangalore': { airport: 'Kempegowda International Airport', code: 'BLR' },
    'Chennai': { airport: 'Chennai International Airport', code: 'MAA' },
    'Kolkata': { airport: 'Netaji Subhas Chandra Bose International Airport', code: 'CCU' },
    'Hyderabad': { airport: 'Rajiv Gandhi International Airport', code: 'HYD' },
    'Goa': { airport: 'Manohar International Airport', code: 'GOX' },
    'Pune': { airport: 'Pune Airport', code: 'PNQ' },
  };

  return routes.map(r => {
    const src = airportMap[r.from] || { airport: `${r.from} Airport`, code: r.from.substring(0, 3).toUpperCase() };
    const dest = airportMap[r.to] || { airport: `${r.to} Airport`, code: r.to.substring(0, 3).toUpperCase() };
    const economyPrice = 2500 + Math.floor(r.dur * 15 + Math.random() * 1500);

    return {
      flightId: `${r.airline.replace(/\s/g, '')}-${r.fn}`,
      airline: r.airline, airlineLogo: '',
      flightNumber: `${r.airline.substring(0, 2).toUpperCase()}-${r.fn}`,
      source: { city: r.from, ...src },
      destination: { city: r.to, ...dest },
      departure: r.dep, arrival: r.arr, duration: formatDuration(r.dur), durationMinutes: r.dur,
      stops: 0, stopDetails: [],
      classes: [
        { type: 'economy', name: 'Economy', price: economyPrice, totalSeats: 150, availableSeats: 50 + Math.floor(Math.random() * 70) },
        { type: 'premium_economy', name: 'Premium Economy', price: Math.round(economyPrice * 1.8), totalSeats: 30, availableSeats: 10 + Math.floor(Math.random() * 15) },
        { type: 'business', name: 'Business', price: Math.round(economyPrice * 3.5), totalSeats: 12, availableSeats: 3 + Math.floor(Math.random() * 6) },
      ],
      aircraft: ['Boeing 737', 'Airbus A320', 'Airbus A321neo', 'Boeing 787'][Math.floor(Math.random() * 4)],
      amenities: ['In-flight Meals', 'WiFi', 'USB Charging', 'Entertainment'].slice(0, 2 + Math.floor(Math.random() * 3)),
      rating: +(3.5 + Math.random() * 1.5).toFixed(1),
      operatingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], isActive: true,
    };
  });
}

function generateBuses() {
  const operators = ['VRL Travels', 'SRS Travels', 'KSRTC', 'MSRTC', 'APSRTC', 'Orange Travels', 'Neeta Travels', 'Paulo Travels', 'KPN Travels', 'IntrCity SmartBus', 'Zingbus', 'Sharma Transports'];
  const busTypes = ['Volvo Multi-Axle A/C Sleeper', 'Volvo A/C Semi-Sleeper', 'Non-A/C Seater', 'A/C Seater', 'Mercedes Multi-Axle A/C Sleeper'];

  const routes = [
    { from: 'Mumbai', to: 'Pune', dur: 210, price: 400 },
    { from: 'Mumbai', to: 'Goa', dur: 540, price: 800 },
    { from: 'Mumbai', to: 'Bangalore', dur: 960, price: 1200 },
    { from: 'Mumbai', to: 'Ahmedabad', dur: 480, price: 600 },
    { from: 'Delhi', to: 'Jaipur', dur: 330, price: 500 },
    { from: 'Delhi', to: 'Agra', dur: 240, price: 400 },
    { from: 'Delhi', to: 'Chandigarh', dur: 300, price: 450 },
    { from: 'Delhi', to: 'Dehradun', dur: 360, price: 550 },
    { from: 'Delhi', to: 'Lucknow', dur: 540, price: 700 },
    { from: 'Delhi', to: 'Manali', dur: 780, price: 1100 },
    { from: 'Bangalore', to: 'Chennai', dur: 360, price: 500 },
    { from: 'Bangalore', to: 'Hyderabad', dur: 600, price: 850 },
    { from: 'Bangalore', to: 'Goa', dur: 660, price: 900 },
    { from: 'Bangalore', to: 'Mysore', dur: 180, price: 300 },
    { from: 'Chennai', to: 'Pondicherry', dur: 210, price: 300 },
    { from: 'Chennai', to: 'Coimbatore', dur: 480, price: 650 },
    { from: 'Hyderabad', to: 'Vijayawada', dur: 330, price: 450 },
    { from: 'Kolkata', to: 'Digha', dur: 270, price: 350 },
    { from: 'Pune', to: 'Goa', dur: 480, price: 700 },
    { from: 'Ahmedabad', to: 'Udaipur', dur: 360, price: 500 },
    { from: 'Jaipur', to: 'Udaipur', dur: 420, price: 550 },
    { from: 'Kochi', to: 'Trivandrum', dur: 270, price: 350 },
    { from: 'Mumbai', to: 'Nashik', dur: 240, price: 350 },
    { from: 'Indore', to: 'Bhopal', dur: 270, price: 350 },
  ];

  const buses = [];
  let counter = 1;

  routes.forEach(route => {
    const numBuses = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numBuses; i++) {
      const operator = operators[Math.floor(Math.random() * operators.length)];
      const busType = busTypes[Math.floor(Math.random() * busTypes.length)];
      const isAC = busType.includes('A/C');
      const isSleeper = busType.includes('Sleeper');

      const depHour = Math.floor(Math.random() * 14) + 6;
      const depMin = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      const depTime = `${String(depHour).padStart(2, '0')}:${String(depMin).padStart(2, '0')}`;
      const arrMinutes = depHour * 60 + depMin + route.dur;
      const arrHour = Math.floor(arrMinutes / 60) % 24;
      const arrMin = arrMinutes % 60;
      const arrTime = `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`;

      const priceMult = isAC ? (isSleeper ? 1.6 : 1.3) : 1.0;
      const basePrice = Math.round(route.price * priceMult * (0.8 + Math.random() * 0.4));

      const classes = [];
      if (isSleeper) classes.push({ type: 'sleeper', name: 'Sleeper', price: basePrice, totalSeats: 36, availableSeats: 5 + Math.floor(Math.random() * 25) });
      if (busType.includes('Semi')) classes.push({ type: 'semi_sleeper', name: 'Semi-Sleeper', price: Math.round(basePrice * 0.85), totalSeats: 40, availableSeats: 5 + Math.floor(Math.random() * 30) });
      classes.push({ type: 'seater', name: 'Seater', price: Math.round(basePrice * 0.7), totalSeats: 45, availableSeats: 10 + Math.floor(Math.random() * 30) });

      const amenities = [];
      if (isAC) amenities.push('AC');
      amenities.push('Water Bottle');
      if (Math.random() > 0.5) amenities.push('WiFi');
      if (Math.random() > 0.4) amenities.push('Charging Point');
      if (isSleeper) amenities.push('Blanket', 'Pillow');

      buses.push({
        busId: `BUS-${String(counter++).padStart(3, '0')}`,
        operator, busType,
        source: { city: route.from, terminal: `${route.from} Bus Terminal` },
        destination: { city: route.to, terminal: `${route.to} Bus Terminal` },
        departure: depTime, arrival: arrTime,
        duration: formatDuration(route.dur), durationMinutes: route.dur,
        classes, amenities,
        rating: +(3.2 + Math.random() * 1.8).toFixed(1),
        boardingPoints: [`${route.from} Central`, `${route.from} Station`],
        droppingPoints: [`${route.to} Central`, `${route.to} Station`],
        operatingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        isActive: true,
      });
    }
  });

  return buses;
}

module.exports = { generateFallbackTrains, generateFallbackFlights, generateBuses, formatDuration };
