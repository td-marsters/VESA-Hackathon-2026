const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.COSMOS_CONNECTION_STRING, {
      dbName: process.env.DB_NAME,
    });
    console.log('Connected to Cosmos DB');
  } catch (error) {
    console.error('Connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;