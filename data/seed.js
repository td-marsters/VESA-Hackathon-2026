const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

const User = require('./models/user');
const Wallet = require('./models/wallet');

async function seed() {
  await mongoose.connect(process.env.COSMOS_CONNECTION_STRING, {
    dbName: process.env.DB_NAME,
  });
  console.log('Connected to Cosmos DB');

  const user = await User.create({
    name: 'Test User',
    age: 25,
  });
  console.log('Created user:', user._id.toString());

  const wallet = await Wallet.create({
    userId: user._id,
    amount: 100,
  });

  // Link wallet back to user
  await User.findByIdAndUpdate(user._id, { walletId: wallet._id });
  console.log('Created wallet:', wallet._id.toString());

  await mongoose.disconnect();
  console.log('Done! Test with userId:', user._id.toString());
}

seed().catch(console.error);