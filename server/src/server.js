const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
const https = require('https');

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

      // Heartbeat to keep service alive on free tiers (like Render)
      const externalUrl = process.env.RENDER_EXTERNAL_URL;
      if (externalUrl) {
        console.log(`💓 Heartbeat activated for: ${externalUrl}`);
        setInterval(() => {
          https.get(`${externalUrl}/api/health`, (res) => {
            console.log(`[${new Date().toISOString()}] 💓 Heartbeat Ping: ${res.statusCode}`);
          }).on('error', (err) => {
            console.error(`💓 Heartbeat Error: ${err.message}`);
          });
        }, 14 * 60 * 1000); // 14 minutes
      }
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
