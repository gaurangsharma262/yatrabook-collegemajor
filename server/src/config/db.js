const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    console.warn(`⚠️  MongoDB Atlas connection failed: ${error.message}`);
    console.log('🔄 Falling back to in-memory MongoDB...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
      console.log(`📦 Database: ${conn.connection.name}`);
      console.log('⚠️  Data will be lost when server stops (in-memory mode)');
      
      // Auto-seed since in-memory DB is always empty
      await autoSeed();
    } catch (fallbackError) {
      console.error(`❌ Fallback MongoDB also failed: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

/**
 * Auto-seed the in-memory database with essential data
 */
async function autoSeed() {
  console.log('\n🌱 Auto-seeding in-memory database...');
  
  const Train = require('../models/Train');
  const Flight = require('../models/Flight');
  const Bus = require('../models/Bus');
  const User = require('../models/User');
  
  // Check if already seeded
  const trainCount = await Train.countDocuments();
  if (trainCount > 0) return;

  try {
    // Load and run seed data inline
    const fs = require('fs');
    const path = require('path');
    const seedPath = path.join(__dirname, '../../data/seed-data.js');
    
    // Use the seed-data module if it exists, otherwise use fallback
    const { generateFallbackTrains, generateFallbackFlights, generateBuses } = require('../../data/seed-data');
    
    const trains = generateFallbackTrains();
    const flights = generateFallbackFlights();
    const buses = generateBuses();
    
    await Train.insertMany(trains);
    await Flight.insertMany(flights);
    await Bus.insertMany(buses);
    
    // Create demo user
    const existingUser = await User.findOne({ email: 'demo@yatrabook.com' });
    if (!existingUser) {
      await User.create({
        name: 'Demo User',
        email: 'demo@yatrabook.com',
        password: 'demo123456',
        phone: '9876543210',
        role: 'user',
      });
    }
    
    console.log(`   ✅ Seeded: ${trains.length} trains, ${flights.length} flights, ${buses.length} buses`);
    console.log(`   ✅ Demo user: demo@yatrabook.com / demo123456`);
  } catch (seedError) {
    console.error('   ⚠️  Auto-seed failed:', seedError.message);
  }
}

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB error: ${err.message}`);
});

module.exports = connectDB;
