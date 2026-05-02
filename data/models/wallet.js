const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  amount: { type: Number, min: 0, required: true }
}); 

module.exports = mongoose.model('Wallet', walletSchema);