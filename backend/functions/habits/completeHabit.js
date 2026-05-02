const { app } = require("@azure/functions");
const { ObjectId } = require("mongodb");
const { getDb } = require("../../../data/db");



app.http("completeHabit", {
  methods: ["PATCH"],
  authLevel: "anonymous",
  route: "habits/{habitId}/complete",
  handler: async (req, context) => {
    const { habitId } = req.params;

    let objectId;
    try {
      objectId = new ObjectId(habitId);
    } catch {
      return { status: 400, jsonBody: { error: "Invalid habit ID" } };
    }

    const db = await getDb();

    const habit = await db.collection("activeHabits").findOne({ _id: objectId });
    if (!habit) {
      return { status: 404, jsonBody: { error: "Habit not found" } };
    }

    await db.collection("wallet").updateOne(
      { userId: habit.userId },
      { $inc: {amount: habit.payOut} }
    );

    await db.collection("completedHabits").insertOne({
      userId: habit.userId,
      habitId: objectId,
      completedDate: new Date(),
    });

    return {
      status: 200,
      jsonBody: { message: "Habit completed!"}
    };
  },
});