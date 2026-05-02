const mongoose = require('mongoose');

const habitsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  title:     { type: String, required: true, trim: true },
  payOut: { type: Number, required: true },
  description: { type: String},
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'fortnightly'],
  },
  repeatable: { type: Boolean, default: false },
  cooldown: { type: Boolean, default: false },
  emoji: {type: String, required: true}
}); 

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  habits: { type:[habitsSchema], default: new []}
}); 

module.exports = mongoose.model('users', userSchema);