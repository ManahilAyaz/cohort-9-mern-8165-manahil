const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not set - check your .env file');
  }

  await mongoose.connect(uri);
  return mongoose.connection;
}

module.exports = connectDB;
