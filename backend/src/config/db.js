const mongoose = require('mongoose');
const logger = require('./logger');
require('dotenv').config();

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not set - check your .env file');
  }

  try {
    await mongoose.connect(uri);
    return mongoose.connection;
  } catch (err) {
    logger.error({ err }, 'Could not connect to MongoDB');
    throw err;
  }
}

module.exports = connectDB;