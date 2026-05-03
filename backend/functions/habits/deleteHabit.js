const { app } = require('@azure/functions');
const { getDb } = require('../../../data/db');
const { ObjectId } = require('mongodb');

app.http('deleteHabit', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'habit/{userId}/{habitId}',
  handler: async (req, context) => {
    const { userId, habitId } = req.params;

    const db = await getDb();
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { habits: { _id: new ObjectId(habitId) } } }
    );

    if (result.modifiedCount === 0) {
      return { status: 404, jsonBody: { error: 'Habit not found' } };
    }

    return { status: 200, jsonBody: { message: 'Habit deleted' } };
  },
});