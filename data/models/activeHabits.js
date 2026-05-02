const mongoose = require('mongoose');

const activeHabitsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  title:     { type: String, required: true, trim: true },
  payOut: { type: Number, required: true },
  description: { type: String},
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'hard', 'impossible'],
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  importance: {
    type: String,
    enum: ['low', 'medium', 'high'],
  },
  repeatable: { type: Boolean, default: false }
}); 

module.exports = mongoose.model('ActiveHabits', activeHabitsSchema);

