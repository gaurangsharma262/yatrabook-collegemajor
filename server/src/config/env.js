const dotenv = require('dotenv');
const path = require('path');

// Load .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/yatrabook',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_dev_only',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

// Validate required env vars in production
if (env.NODE_ENV === 'production') {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

module.exports = env;
