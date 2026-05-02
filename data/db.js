const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' }); // explicit path

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.COSMOS_CONNECTION_STRING, {
      dbName: process.env.DB_NAME,
    });
    isConnected = true;
    console.log('Connected to Cosmos DB');
  } catch (error) {
    console.error('Connection failed:', error.message);
    process.exit(1);
  }
};

const getDb = async () => {
  await connectDB();
  return mongoose.connection.db;
};

module.exports = { connectDB, getDb };