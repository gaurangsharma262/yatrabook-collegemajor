/**
 * Database Seeder Script
 * Transforms raw train/flight data from user's datasets and seeds MongoDB
 * Run: npm run seed
 */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

// Load env
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Train = require('../src/models/Train');
const Flight = require('../src/models/Flight');
const Bus = require('../src/models/Bus');
const User = require('../src/models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yatrabook';

// ─── Price Maps (realistic Indian pricing) ──────────────────────
const trainPricePerKm = {
  '1A': 4.0,
  '2A': 2.5,
  '3A': 1.8,
  'SL': 0.7,
  'CC': 1.5,
  '2S': 0.4,
};

const flightBasePrice = {
  economy: 2500,
  premium_economy: 5000,
  business: 12000,
};

// ─── Transform Train Data ──────────────────────────────────────
const transformTrains = (rawTrains) => {
  const features = rawTrains.features || rawTrains;
  const seen = new Set();
  const trains = [];

  for (const feature of features) {
    const p = feature.properties;
    if (!p || !p.number || !p.name) continue;

    // Skip duplicates
    if (seen.has(p.number)) continue;
    seen.add(p.number);

    const distance = p.distance || 500;
    const durationMinutes = (p.duration_h || 0) * 60 + (p.duration_m || 0);

    // Build classes based on available flags
    const classes = [];
    if (p.first_ac) {
      const price = Math.round(distance * trainPricePerKm['1A']);
      classes.push({
        type: '1A', name: 'First AC',
        price: Math.max(price, 800),
        totalSeats: 24, availableSeats: Math.floor(Math.random() * 18) + 4, waitlistCount: 0
      });
    }
    if (p.second_ac) {
      const price = Math.round(distance * trainPricePerKm['2A']);
      classes.push({
        type: '2A', name: 'Second AC',
        price: Math.max(price, 500),
        totalSeats: 54, availableSeats: Math.floor(Math.random() * 40) + 8, waitlistCount: 0
      });
    }
    if (p.third_ac) {
      const price = Math.round(distance * trainPricePerKm['3A']);
      classes.push({
        type: '3A', name: 'Third AC',
        price: Math.max(price, 350),
        totalSeats: 72, availableSeats: Math.floor(Math.random() * 50) + 15, waitlistCount: 0
      });
    }
    if (p.sleeper) {
      const price = Math.round(distance * trainPricePerKm['SL']);
      classes.push({
        type: 'SL', name: 'Sleeper',
        price: Math.max(price, 200),
        totalSeats: 120, availableSeats: Math.floor(Math.random() * 80) + 20, waitlistCount: 0
      });
    }
    if (p.chair_car) {
      const price = Math.round(distance * trainPricePerKm['CC']);
      classes.push({
        type: 'CC', name: 'Chair Car',
        price: Math.max(price, 300),
        totalSeats: 78, availableSeats: Math.floor(Math.random() * 60) + 10, waitlistCount: 0
      });
    }

    // If no classes detected, add default
    if (classes.length === 0) {
      classes.push({
        type: 'SL', name: 'Sleeper',
        price: Math.max(Math.round(distance * 0.7), 200),
        totalSeats: 120, availableSeats: Math.floor(Math.random() * 80) + 20, waitlistCount: 0
      });
      classes.push({
        type: '3A', name: 'Third AC',
        price: Math.max(Math.round(distance * 1.8), 350),
        totalSeats: 72, availableSeats: Math.floor(Math.random() * 50) + 15, waitlistCount: 0
      });
    }

    // Format times
    const departure = p.departure ? p.departure.substring(0, 5) : '06:00';
    const arrival = p.arrival ? p.arrival.substring(0, 5) : '18:00';

    // Amenities based on train type
    const amenities = ['Charging Point'];
    if (p.type === 'SF' || p.type === 'RAJ') amenities.push('Pantry Car', 'WiFi');
    if (p.type === 'RAJ' || p.type === 'SHT') amenities.push('Catering', 'Reading Light');
    if (p.first_ac || p.second_ac) amenities.push('Bedding');

    const trainType = p.type || 'EXP';
    const typeNames = {
      'RAJ': 'Rajdhani', 'SHT': 'Shatabdi', 'SF': 'Superfast',
      'EXP': 'Express', 'DUR': 'Duronto', 'MAL': 'Mail',
      'PASS': 'Passenger', 'GR': 'Garib Rath'
    };

    trains.push({
      trainId: p.number,
      name: p.name,
      trainNumber: p.number,
      source: {
        city: formatStationCity(p.from_station_name),
        station: p.from_station_name,
        code: p.from_station_code,
      },
      destination: {
        city: formatStationCity(p.to_station_name),
        station: p.to_station_name,
        code: p.to_station_code,
      },
      departure,
      arrival,
      duration: formatDuration(durationMinutes),
      durationMinutes,
      runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      stops: [],
      classes,
      rating: (3.5 + Math.random() * 1.5).toFixed(1) * 1,
      amenities,
      isActive: true,
    });
  }

  return trains;
};

// ─── Transform Flight Data ─────────────────────────────────────
const transformFlights = (rawFlights) => {
  const seen = new Set();
  const flights = [];

  // City to airport mapping
  const airportMap = {
    'Delhi': { airport: 'Indira Gandhi International Airport', code: 'DEL' },
    'Mumbai': { airport: 'Chhatrapati Shivaji Maharaj International Airport', code: 'BOM' },
    'Bangalore': { airport: 'Kempegowda International Airport', code: 'BLR' },
    'Bengaluru': { airport: 'Kempegowda International Airport', code: 'BLR' },
    'Chennai': { airport: 'Chennai International Airport', code: 'MAA' },
    'Kolkata': { airport: 'Netaji Subhas Chandra Bose International Airport', code: 'CCU' },
    'Hyderabad': { airport: 'Rajiv Gandhi International Airport', code: 'HYD' },
    'Pune': { airport: 'Pune Airport', code: 'PNQ' },
    'Ahmedabad': { airport: 'Sardar Vallabhbhai Patel International Airport', code: 'AMD' },
    'Goa': { airport: 'Manohar International Airport', code: 'GOX' },
    'Jaipur': { airport: 'Jaipur International Airport', code: 'JAI' },
    'Lucknow': { airport: 'Chaudhary Charan Singh International Airport', code: 'LKO' },
    'Kochi': { airport: 'Cochin International Airport', code: 'COK' },
    'Cochin': { airport: 'Cochin International Airport', code: 'COK' },
    'Patna': { airport: 'Jay Prakash Narayan International Airport', code: 'PAT' },
    'Chandigarh': { airport: 'Chandigarh Airport', code: 'IXC' },
    'Bhopal': { airport: 'Raja Bhoj Airport', code: 'BHO' },
    'Indore': { airport: 'Devi Ahilyabai Holkar Airport', code: 'IDR' },
    'Nagpur': { airport: 'Dr. Babasaheb Ambedkar International Airport', code: 'NAG' },
    'Varanasi': { airport: 'Lal Bahadur Shastri Airport', code: 'VNS' },
    'Coimbatore': { airport: 'Coimbatore International Airport', code: 'CJB' },
    'Srinagar': { airport: 'Sheikh ul-Alam International Airport', code: 'SXR' },
    'Thiruvananthapuram': { airport: 'Trivandrum International Airport', code: 'TRV' },
    'Trivandrum': { airport: 'Trivandrum International Airport', code: 'TRV' },
    'Visakhapatnam': { airport: 'Visakhapatnam Airport', code: 'VTZ' },
    'Ranchi': { airport: 'Birsa Munda Airport', code: 'IXR' },
    'Bhubaneswar': { airport: 'Biju Patnaik International Airport', code: 'BBI' },
    'Guwahati': { airport: 'Lokpriya Gopinath Bordoloi International Airport', code: 'GAU' },
    'Mangalore': { airport: 'Mangalore International Airport', code: 'IXE' },
    'Amritsar': { airport: 'Sri Guru Ram Dass Jee International Airport', code: 'ATQ' },
    'Raipur': { airport: 'Swami Vivekananda Airport', code: 'RPR' },
    'Bagdogra': { airport: 'Bagdogra Airport', code: 'IXB' },
    'Dehradun': { airport: 'Jolly Grant Airport', code: 'DED' },
    'Vadodara': { airport: 'Vadodara Airport', code: 'BDQ' },
    'Surat': { airport: 'Surat Airport', code: 'STV' },
    'Udaipur': { airport: 'Maharana Pratap Airport', code: 'UDR' },
    'Jodhpur': { airport: 'Jodhpur Airport', code: 'JDH' },
    'Leh': { airport: 'Kushok Bakula Rimpochee Airport', code: 'IXL' },
    'Port Blair': { airport: 'Veer Savarkar International Airport', code: 'IXZ' },
    'Imphal': { airport: 'Imphal Airport', code: 'IMF' },
    'Agartala': { airport: 'Maharaja Bir Bikram Airport', code: 'IXA' },
    'Dibrugarh': { airport: 'Dibrugarh Airport', code: 'DIB' },
    'Silchar': { airport: 'Silchar Airport', code: 'IXS' },
  };

  const getAirportInfo = (city) => {
    const info = airportMap[city];
    if (info) return { city, ...info };
    return { city, airport: `${city} Airport`, code: city.substring(0, 3).toUpperCase() };
  };

  for (const row of rawFlights) {
    const key = `${row.airline}-${row.flightNumber}-${row.origin}-${row.destination}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const srcInfo = getAirportInfo(row.origin);
    const destInfo = getAirportInfo(row.destination);
    const depTime = row.scheduledDepartureTime ? row.scheduledDepartureTime.substring(0, 5) : '06:00';
    const arrTime = row.scheduledArrivalTime ? row.scheduledArrivalTime.substring(0, 5) : '08:00';

    // Calculate duration
    const [dh, dm] = depTime.split(':').map(Number);
    const [ah, am] = arrTime.split(':').map(Number);
    let durMin = (ah * 60 + am) - (dh * 60 + dm);
    if (durMin <= 0) durMin += 24 * 60;

    const days = row.daysOfWeek ? row.daysOfWeek.split(',').map(d => d.trim().substring(0, 3)) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Pricing based on duration (proxy for distance)
    const distFactor = durMin / 120; // normalize around 2 hours
    const economyPrice = Math.round(flightBasePrice.economy * distFactor + Math.random() * 1000);

    flights.push({
      flightId: `${row.airline.replace(/\s/g, '')}-${row.flightNumber}`,
      airline: row.airline,
      airlineLogo: '',
      flightNumber: `${row.airline.substring(0, 2).toUpperCase()}-${row.flightNumber}`,
      source: srcInfo,
      destination: destInfo,
      departure: depTime,
      arrival: arrTime,
      duration: formatDuration(durMin),
      durationMinutes: durMin,
      stops: 0,
      stopDetails: [],
      classes: [
        {
          type: 'economy', name: 'Economy',
          price: Math.max(economyPrice, 2000),
          totalSeats: 150, availableSeats: Math.floor(Math.random() * 100) + 30
        },
        {
          type: 'premium_economy', name: 'Premium Economy',
          price: Math.round(Math.max(economyPrice, 2000) * 1.8),
          totalSeats: 30, availableSeats: Math.floor(Math.random() * 20) + 5
        },
        {
          type: 'business', name: 'Business',
          price: Math.round(Math.max(economyPrice, 2000) * 3.5),
          totalSeats: 12, availableSeats: Math.floor(Math.random() * 8) + 2
        },
      ],
      aircraft: ['Boeing 737', 'Airbus A320', 'ATR 72', 'Boeing 787', 'Airbus A321neo'][Math.floor(Math.random() * 5)],
      amenities: ['In-flight meals', 'WiFi', 'USB Charging', 'Entertainment System'].slice(0, 2 + Math.floor(Math.random() * 3)),
      rating: (3.5 + Math.random() * 1.5).toFixed(1) * 1,
      operatingDays: days,
      isActive: true,
    });
  }

  return flights;
};

// ─── Bus Seed Data (generated, since user has no bus data) ─────
const generateBuses = () => {
  const operators = ['VRL Travels', 'SRS Travels', 'KSRTC', 'MSRTC', 'APSRTC', 'Orange Travels', 'Neeta Travels', 'Paulo Travels', 'Parveen Travels', 'KPN Travels', 'Kallada Travels', 'TSRTC', 'OSRTC', 'UPSRTC', 'RSRTC', 'Sharma Transports', 'National Travels', 'SVR Travels', 'IntrCity SmartBus', 'Zingbus'];
  const busTypes = ['Volvo Multi-Axle A/C Sleeper', 'Volvo A/C Semi-Sleeper', 'Non-A/C Seater', 'A/C Seater', 'Mercedes Multi-Axle A/C Sleeper', 'Scania Multi-Axle A/C Sleeper', 'A/C Sleeper', 'Non-A/C Sleeper'];

  const routes = [
    { from: 'Mumbai', to: 'Pune', dur: 210, price: 400 },
    { from: 'Mumbai', to: 'Goa', dur: 540, price: 800 },
    { from: 'Mumbai', to: 'Bangalore', dur: 960, price: 1200 },
    { from: 'Mumbai', to: 'Ahmedabad', dur: 480, price: 600 },
    { from: 'Mumbai', to: 'Hyderabad', dur: 720, price: 1000 },
    { from: 'Mumbai', to: 'Nashik', dur: 240, price: 350 },
    { from: 'Mumbai', to: 'Shirdi', dur: 330, price: 500 },
    { from: 'Delhi', to: 'Jaipur', dur: 330, price: 500 },
    { from: 'Delhi', to: 'Agra', dur: 240, price: 400 },
    { from: 'Delhi', to: 'Chandigarh', dur: 300, price: 450 },
    { from: 'Delhi', to: 'Dehradun', dur: 360, price: 550 },
    { from: 'Delhi', to: 'Lucknow', dur: 540, price: 700 },
    { from: 'Delhi', to: 'Manali', dur: 780, price: 1100 },
    { from: 'Delhi', to: 'Haridwar', dur: 300, price: 450 },
    { from: 'Bangalore', to: 'Chennai', dur: 360, price: 500 },
    { from: 'Bangalore', to: 'Hyderabad', dur: 600, price: 850 },
    { from: 'Bangalore', to: 'Goa', dur: 660, price: 900 },
    { from: 'Bangalore', to: 'Mysore', dur: 180, price: 300 },
    { from: 'Bangalore', to: 'Coimbatore', dur: 420, price: 600 },
    { from: 'Bangalore', to: 'Pondicherry', dur: 420, price: 650 },
    { from: 'Chennai', to: 'Pondicherry', dur: 210, price: 300 },
    { from: 'Chennai', to: 'Coimbatore', dur: 480, price: 650 },
    { from: 'Chennai', to: 'Madurai', dur: 480, price: 600 },
    { from: 'Chennai', to: 'Tirupati', dur: 180, price: 350 },
    { from: 'Hyderabad', to: 'Vijayawada', dur: 330, price: 450 },
    { from: 'Hyderabad', to: 'Tirupati', dur: 720, price: 900 },
    { from: 'Kolkata', to: 'Digha', dur: 270, price: 350 },
    { from: 'Kolkata', to: 'Siliguri', dur: 660, price: 800 },
    { from: 'Pune', to: 'Goa', dur: 480, price: 700 },
    { from: 'Pune', to: 'Shirdi', dur: 300, price: 400 },
    { from: 'Ahmedabad', to: 'Udaipur', dur: 360, price: 500 },
    { from: 'Ahmedabad', to: 'Rajkot', dur: 240, price: 350 },
    { from: 'Jaipur', to: 'Udaipur', dur: 420, price: 550 },
    { from: 'Jaipur', to: 'Jodhpur', dur: 360, price: 450 },
    { from: 'Lucknow', to: 'Varanasi', dur: 360, price: 450 },
    { from: 'Indore', to: 'Bhopal', dur: 270, price: 350 },
    { from: 'Kochi', to: 'Trivandrum', dur: 270, price: 350 },
    { from: 'Kochi', to: 'Bangalore', dur: 660, price: 900 },
    { from: 'Mangalore', to: 'Bangalore', dur: 480, price: 650 },
    { from: 'Visakhapatnam', to: 'Hyderabad', dur: 720, price: 950 },
  ];

  const buses = [];
  let busCounter = 1;

  routes.forEach((route) => {
    // Generate 2-4 buses per route
    const numBuses = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numBuses; i++) {
      const operator = operators[Math.floor(Math.random() * operators.length)];
      const busType = busTypes[Math.floor(Math.random() * busTypes.length)];
      const isAC = busType.includes('A/C');
      const isSleeper = busType.includes('Sleeper');

      const depHour = Math.floor(Math.random() * 14) + 6; // 6 AM - 8 PM
      const depMin = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      const depTime = `${String(depHour).padStart(2, '0')}:${String(depMin).padStart(2, '0')}`;

      const arrMinutes = depHour * 60 + depMin + route.dur;
      const arrHour = Math.floor(arrMinutes / 60) % 24;
      const arrMin = arrMinutes % 60;
      const arrTime = `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`;

      const priceMult = isAC ? (isSleeper ? 1.6 : 1.3) : (isSleeper ? 1.1 : 1.0);
      const basePrice = Math.round(route.price * priceMult * (0.8 + Math.random() * 0.4));

      const classes = [];
      if (isSleeper) {
        classes.push({
          type: 'sleeper', name: 'Sleeper',
          price: basePrice,
          totalSeats: 36, availableSeats: Math.floor(Math.random() * 25) + 5,
        });
      }
      if (busType.includes('Semi')) {
        classes.push({
          type: 'semi_sleeper', name: 'Semi-Sleeper',
          price: Math.round(basePrice * 0.85),
          totalSeats: 40, availableSeats: Math.floor(Math.random() * 30) + 5,
        });
      }
      classes.push({
        type: 'seater', name: 'Seater',
        price: Math.round(basePrice * 0.7),
        totalSeats: 45, availableSeats: Math.floor(Math.random() * 30) + 10,
      });

      const amenities = [];
      if (isAC) amenities.push('AC');
      amenities.push('Water Bottle');
      if (Math.random() > 0.5) amenities.push('WiFi');
      if (Math.random() > 0.4) amenities.push('Charging Point');
      if (isSleeper) amenities.push('Blanket', 'Pillow');
      if (Math.random() > 0.6) amenities.push('GPS Tracking');

      buses.push({
        busId: `BUS-${String(busCounter++).padStart(3, '0')}`,
        operator,
        busType,
        source: { city: route.from, terminal: `${route.from} Bus Terminal` },
        destination: { city: route.to, terminal: `${route.to} Bus Terminal` },
        departure: depTime,
        arrival: arrTime,
        duration: formatDuration(route.dur),
        durationMinutes: route.dur,
        classes,
        amenities,
        rating: (3.2 + Math.random() * 1.8).toFixed(1) * 1,
        boardingPoints: [`${route.from} Central`, `${route.from} Station`],
        droppingPoints: [`${route.to} Central`, `${route.to} Station`],
        operatingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        isActive: true,
      });
    }
  });

  return buses;
};

// ─── Helpers ───────────────────────────────────────────────────
function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function formatStationCity(stationName) {
  if (!stationName) return 'Unknown';
  // Map common station names to city names
  const cityMap = {
    'NEW DELHI': 'Delhi', 'OLD DELHI': 'Delhi', 'DELHI': 'Delhi',
    'H NIZAMUD': 'Delhi', 'HAZRAT NIZAMUDDIN': 'Delhi',
    'MUMBAI CENTRAL': 'Mumbai', 'MUMBAI CST': 'Mumbai', 'CSMT': 'Mumbai',
    'DADAR': 'Mumbai', 'LOKMANYATILAK': 'Mumbai', 'BANDRA TERMINUS': 'Mumbai',
    'CHENNAI CENTRAL': 'Chennai', 'CHENNAI EGMORE': 'Chennai',
    'HOWRAH JN': 'Kolkata', 'KOLKATA': 'Kolkata', 'SEALDAH': 'Kolkata',
    'BANGALORE CY JN': 'Bangalore', 'KSR BENGALURU': 'Bangalore', 'YESVANTPUR JN': 'Bangalore',
    'SECUNDERABAD JN': 'Hyderabad', 'HYDERABAD DECAN': 'Hyderabad',
    'AHMEDABAD JN': 'Ahmedabad',
    'PUNE JN': 'Pune',
    'JAIPUR': 'Jaipur', 'JAIPUR JN': 'Jaipur',
    'LUCKNOW NR': 'Lucknow', 'LUCKNOW': 'Lucknow', 'LUCKNOW JN': 'Lucknow',
    'KANPUR CENTRAL': 'Kanpur',
    'PATNA JN': 'Patna',
    'BHOPAL JN': 'Bhopal',
    'INDORE JN BG': 'Indore',
    'NAGPUR': 'Nagpur', 'NAGPUR JN': 'Nagpur',
    'VARANASI JN': 'Varanasi',
    'AGRA CANTT': 'Agra',
    'THIRUVANANTHAPUR': 'Trivandrum', 'TRIVANDRUM CTRL': 'Trivandrum',
    'ERNAKULAM JN': 'Kochi', 'ERNAKULAM TOWN': 'Kochi',
    'COIMBATORE JN': 'Coimbatore',
    'MADURAI JN': 'Madurai',
    'VISAKHAPATNAM': 'Visakhapatnam',
    'GUWAHATI': 'Guwahati',
    'CHANDIGARH': 'Chandigarh',
    'AMRITSAR JN': 'Amritsar',
    'JAMMU TAWI': 'Jammu',
    'DEHRADUN': 'Dehradun',
    'GORAKHPUR JN': 'Gorakhpur',
    'ALLAHABAD JN': 'Prayagraj', 'PRAYAGRAJ JN': 'Prayagraj',
    'RANCHI': 'Ranchi',
    'BHUBANESWAR': 'Bhubaneswar',
    'RAIPUR JN': 'Raipur',
    'UJJAIN JN': 'Ujjain',
    'JODHPUR JN': 'Jodhpur',
    'UDAIPUR CITY': 'Udaipur',
    'GOA': 'Goa', 'MADGAON JN': 'Goa',
    'MYSORE JN': 'Mysore', 'MYSURU JN': 'Mysore',
    'MGR CHENNAI CTL': 'Chennai',
    'SALEM JN': 'Salem',
  };

  // Try exact match
  const upper = stationName.toUpperCase().trim();
  if (cityMap[upper]) return cityMap[upper];

  // Try partial match
  for (const [key, city] of Object.entries(cityMap)) {
    if (upper.includes(key) || key.includes(upper)) return city;
  }

  // Fallback: capitalize first letter of each word
  return stationName.split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
    .replace(/ Jn$| JN$/i, '')
    .trim();
}

// ─── Main Seed Function ───────────────────────────────────────
async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      Train.deleteMany({}),
      Flight.deleteMany({}),
      Bus.deleteMany({}),
    ]);

    // ─── Process Trains ──────────────────────────────────────
    const trainsFilePath = path.join(__dirname, 'datasets/trains/trains.json');
    const trainsZipPath = path.join(__dirname, 'datasets/trains.json.zip');

    let trainCount = 0;
    if (fs.existsSync(trainsFilePath)) {
      console.log('\n🚂 Processing trains data...');
      const rawTrains = JSON.parse(fs.readFileSync(trainsFilePath, 'utf8'));
      const trains = transformTrains(rawTrains);

      // Pick top 200 trains for reasonable dataset size
      const selectedTrains = trains.slice(0, 200);
      await Train.insertMany(selectedTrains);
      trainCount = selectedTrains.length;
      console.log(`   ✅ Inserted ${trainCount} trains`);
    } else {
      console.log('   ⚠️  trains.json not found. Run: Expand-Archive datasets/trains.json.zip -DestinationPath datasets/trains');
      console.log('   📝 Generating fallback train data...');
      const fallbackTrains = generateFallbackTrains();
      await Train.insertMany(fallbackTrains);
      trainCount = fallbackTrains.length;
      console.log(`   ✅ Inserted ${trainCount} fallback trains`);
    }

    // ─── Process Flights ─────────────────────────────────────
    const flightsFilePath = path.join(__dirname, 'datasets/Air-Clean.csv');
    let flightCount = 0;

    if (fs.existsSync(flightsFilePath)) {
      console.log('\n✈️  Processing flights data...');
      const rawFlights = await csv().fromFile(flightsFilePath);
      const flights = transformFlights(rawFlights);

      // Select a diverse subset
      const selectedFlights = flights.slice(0, 200);
      await Flight.insertMany(selectedFlights);
      flightCount = selectedFlights.length;
      console.log(`   ✅ Inserted ${flightCount} flights`);
    } else {
      console.log('   ⚠️  Air-Clean.csv not found');
      console.log('   📝 Generating fallback flight data...');
      const fallbackFlights = generateFallbackFlights();
      await Flight.insertMany(fallbackFlights);
      flightCount = fallbackFlights.length;
      console.log(`   ✅ Inserted ${flightCount} fallback flights`);
    }

    // ─── Process Buses ───────────────────────────────────────
    console.log('\n🚌 Generating bus data...');
    const buses = generateBuses();
    await Bus.insertMany(buses);
    console.log(`   ✅ Inserted ${buses.length} buses`);

    // ─── Create demo user ────────────────────────────────────
    console.log('\n👤 Creating demo user...');
    const existingUser = await User.findOne({ email: 'demo@yatrabook.com' });
    if (!existingUser) {
      await User.create({
        name: 'Demo User',
        email: 'demo@yatrabook.com',
        password: 'demo123456',
        phone: '9876543210',
        role: 'user',
      });
      console.log('   ✅ Demo user created (demo@yatrabook.com / demo123456)');
    } else {
      console.log('   ℹ️  Demo user already exists');
    }

    // ─── Summary ─────────────────────────────────────────────
    console.log('\n╔═════════════════════════════════════════╗');
    console.log('║         🌱 Seed Complete!               ║');
    console.log('╠═════════════════════════════════════════╣');
    console.log(`║  Trains:  ${String(trainCount).padEnd(29)}║`);
    console.log(`║  Flights: ${String(flightCount).padEnd(29)}║`);
    console.log(`║  Buses:   ${String(buses.length).padEnd(29)}║`);
    console.log('╚═════════════════════════════════════════╝\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// ─── Fallback data generators (if user's files are missing) ─────
function generateFallbackTrains() {
  const trainData = [
    { id: '12301', name: 'Rajdhani Express', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Mumbai', toStn: 'Mumbai Central', toCode: 'MMCT', dep: '16:55', arr: '08:35', dur: 940, dist: 1384 },
    { id: '12302', name: 'Rajdhani Express', from: 'Mumbai', fromStn: 'Mumbai Central', fromCode: 'MMCT', to: 'Delhi', toStn: 'New Delhi', toCode: 'NDLS', dep: '17:40', arr: '08:35', dur: 895, dist: 1384 },
    { id: '12951', name: 'Mumbai Rajdhani', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Mumbai', toStn: 'Mumbai Central', toCode: 'MMCT', dep: '16:25', arr: '08:15', dur: 950, dist: 1384 },
    { id: '12259', name: 'Sealdah Duronto', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Kolkata', toStn: 'Sealdah', toCode: 'SDAH', dep: '20:05', arr: '12:55', dur: 1010, dist: 1453 },
    { id: '12001', name: 'Bhopal Shatabdi', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Bhopal', toStn: 'Bhopal Jn', toCode: 'BPL', dep: '06:00', arr: '14:35', dur: 515, dist: 707 },
    { id: '12002', name: 'Bhopal Shatabdi', from: 'Bhopal', fromStn: 'Bhopal Jn', fromCode: 'BPL', to: 'Delhi', toStn: 'New Delhi', toCode: 'NDLS', dep: '15:30', arr: '23:25', dur: 475, dist: 707 },
    { id: '12627', name: 'Karnataka Express', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Bangalore', toStn: 'KSR Bengaluru', toCode: 'SBC', dep: '21:20', arr: '06:40', dur: 2000, dist: 2444 },
    { id: '12621', name: 'Tamil Nadu Express', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Chennai', toStn: 'Chennai Central', toCode: 'MAS', dep: '22:30', arr: '07:10', dur: 1960, dist: 2182 },
    { id: '12431', name: 'Trivandrum Rajdhani', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Trivandrum', toStn: 'Trivandrum Central', toCode: 'TVC', dep: '11:25', arr: '18:55', dur: 1890, dist: 3149 },
    { id: '12309', name: 'Rajdhani Express', from: 'Delhi', fromStn: 'New Delhi', fromCode: 'NDLS', to: 'Patna', toStn: 'Rajendra Nagar', toCode: 'RJPB', dep: '16:50', arr: '05:15', dur: 745, dist: 1001 },
  ];

  return trainData.map(t => ({
    trainId: t.id, name: t.name, trainNumber: t.id,
    source: { city: t.from, station: t.fromStn, code: t.fromCode },
    destination: { city: t.to, station: t.toStn, code: t.toCode },
    departure: t.dep, arrival: t.arr, duration: formatDuration(t.dur), durationMinutes: t.dur,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: [], classes: [
      { type: '1A', name: 'First AC', price: Math.round(t.dist * 4), totalSeats: 24, availableSeats: 18, waitlistCount: 0 },
      { type: '2A', name: 'Second AC', price: Math.round(t.dist * 2.5), totalSeats: 54, availableSeats: 35, waitlistCount: 0 },
      { type: '3A', name: 'Third AC', price: Math.round(t.dist * 1.8), totalSeats: 72, availableSeats: 50, waitlistCount: 0 },
      { type: 'SL', name: 'Sleeper', price: Math.round(t.dist * 0.7), totalSeats: 120, availableSeats: 80, waitlistCount: 0 },
    ],
    rating: 4.2, amenities: ['Pantry Car', 'Charging Point', 'WiFi'], isActive: true,
  }));
}

function generateFallbackFlights() {
  const routes = [
    { airline: 'Air India', fn: '101', from: 'Delhi', to: 'Mumbai', dep: '06:00', arr: '08:15', dur: 135 },
    { airline: 'IndiGo', fn: '201', from: 'Delhi', to: 'Bangalore', dep: '07:30', arr: '10:15', dur: 165 },
    { airline: 'SpiceJet', fn: '301', from: 'Mumbai', to: 'Chennai', dep: '09:00', arr: '11:00', dur: 120 },
    { airline: 'Vistara', fn: '401', from: 'Delhi', to: 'Kolkata', dep: '08:00', arr: '10:30', dur: 150 },
    { airline: 'Air India', fn: '501', from: 'Bangalore', to: 'Delhi', dep: '11:00', arr: '14:00', dur: 180 },
  ];
  return routes.map(r => ({
    flightId: `${r.airline.replace(/\s/g, '')}-${r.fn}`, airline: r.airline, airlineLogo: '',
    flightNumber: `${r.airline.substring(0, 2).toUpperCase()}-${r.fn}`,
    source: { city: r.from, airport: `${r.from} Airport`, code: r.from.substring(0, 3).toUpperCase() },
    destination: { city: r.to, airport: `${r.to} Airport`, code: r.to.substring(0, 3).toUpperCase() },
    departure: r.dep, arrival: r.arr, duration: formatDuration(r.dur), durationMinutes: r.dur,
    stops: 0, stopDetails: [],
    classes: [
      { type: 'economy', name: 'Economy', price: 3500 + Math.floor(Math.random() * 2000), totalSeats: 150, availableSeats: 80 },
      { type: 'business', name: 'Business', price: 12000 + Math.floor(Math.random() * 5000), totalSeats: 12, availableSeats: 6 },
    ],
    aircraft: 'Airbus A320', amenities: ['In-flight meals', 'WiFi'], rating: 4.0,
    operatingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], isActive: true,
  }));
}

seed();
