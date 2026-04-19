const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(env.PORT, () => {
      console.log('');
      console.log('╔═══════════════════════════════════════════╗');
      console.log('║     🚀 YatraBook API Server Running      ║');
      console.log('╠═══════════════════════════════════════════╣');
      console.log(`║  Port:        ${env.PORT}                        ║`);
      console.log(`║  Environment: ${env.NODE_ENV.padEnd(27)}║`);
      console.log(`║  API:         http://localhost:${env.PORT}/api   ║`);
      console.log('╚═══════════════════════════════════════════╝');
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

startServer();
