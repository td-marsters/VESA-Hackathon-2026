const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true },
  cost: { type: Number, required: true },
  description: { type: String},
}); 

module.exports = mongoose.model('Item', itemSchema);

