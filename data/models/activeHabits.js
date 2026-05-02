const mongoose = require('mongoose');

const activeHabitsSchema = new mongoose.Schema({
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

module.exports = mongoose.model('ActiveHabits', activeHabitsSchema);

