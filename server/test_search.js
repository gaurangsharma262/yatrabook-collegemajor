const connectDB = require('./src/config/db');
const Train = require('./src/models/Train');
const Flight = require('./src/models/Flight');
const Bus = require('./src/models/Bus');

(async () => {
  await connectDB();
  
  // Wait a bit for auto-seed to finish
  setTimeout(async () => {
    try {
      const trains = await Train.find({});
      console.log('Total trains in DB:', trains.length);
      
      const filter = {
        isActive: true,
        $or: [
          { 'source.city': { $regex: new RegExp('Delhi', 'i') } },
          { 'source.code': { $regex: new RegExp('Delhi', 'i') } },
        ],
        $and: [
          {
            $or: [
              { 'destination.city': { $regex: new RegExp('Mumbai', 'i') } },
              { 'destination.code': { $regex: new RegExp('Mumbai', 'i') } },
            ],
          },
        ]
      };
      const found = await Train.find(filter);
      console.log('Found trains from Delhi to Mumbai:', found.length);
      if(found.length > 0) console.log(found[0].name);

      const flights = await Flight.find({});
      console.log('Total flights in DB:', flights.length);

      const buses = await Bus.find({});
      console.log('Total buses in DB:', buses.length);

    } catch (e) {
      console.error(e);
    }
    process.exit(0);
  }, 2000);
})();
