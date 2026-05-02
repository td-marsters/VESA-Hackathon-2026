const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  amount:     { type: Number, min: 0,required: true}
}); 

module.exports = mongoose.model('Wallet', walletSchema);