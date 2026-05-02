const { app } = require("@azure/functions");
const { ObjectId } = require("mongodb");
const { getDb } = require("../../../data/db");

app.http("completeHabit", {
  methods: ["PATCH"],
  authLevel: "anonymous",
  route: "habit/{userId}/{habitId}/complete",
  handler: async (req, context) => {
    const { userId, habitId } = req.params;

    let userObjectId, habitObjectId;
    try {
      userObjectId = new ObjectId(userId);
      habitObjectId = new ObjectId(habitId);
    } catch {
      return { status: 400, jsonBody: { error: "Invalid ID" } };
    }

    const db = await getDb();

    // find the user and the specific habit
    const user = await db.collection("users").findOne(
      { _id: userObjectId, "habits._id": habitObjectId }
    );

    if (!user) {
      return { status: 404, jsonBody: { error: "User or habit not found" } };
    }

    const habit = user.habits.find(h => h._id.toString() === habitId);

    if (habit.completed) {
      return { status: 400, jsonBody: { error: "Habit already completed" } };
    }

    // mark habit as completed
    await db.collection("users").updateOne(
      { _id: userObjectId, "habits._id": habitObjectId },
      { $set: { "habits.$.cooldown": true } }
    );

    // add reward to wallet
    await db.collection("wallets").updateOne(
      { userId: userObjectId },
      { $inc: { amount: habit.reward } }
    );

    return {
      status: 200,
      jsonBody: { message: "Habit completed!", reward: habit.reward }
    };
  },
});