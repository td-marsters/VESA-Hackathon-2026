const mongoose = require('mongoose');

const completedHabitsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  habitID: { type: mongoose.Schema.Types.ObjectId, ref: 'ActiveHabit' },
  completedDate: { type: Date, required: true },
}); 

module.exports = mongoose.model('CompletedHabits', completedHabitsSchema);
