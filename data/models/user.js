const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  age:      { type: Number, min: 0, max: 120 },

  walletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' }

}); 

module.exports = mongoose.model('User', userSchema);