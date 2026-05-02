const { app } = require("@azure/functions");
const { getDb } = require("../../../data/db");
const activeHabits = require("../../../data/models/activeHabits");

app.http("createHabit", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "habit",
  handler: async (req, context) => {
    let body;
    try {
      body = await req.json();
    } catch {
      return { status: 400, jsonBody: { error: "Invalid JSON body" } };
    }

    const { userId, title, payOut, description, difficulty, startDate, endDate, importance, repeatable, emoji} = body;
    if (!title || !payOut) {
      return { status: 400, jsonBody: { error: "title/payOut is required" } };
    }

    const db = await getDb();
    const habits = db.collection("ActiveHabits");

    const existing = await habits.findOne({ title });
    if (existing) {
      return { status: 409, jsonBody: { error: "Habit already exists" } };
    }

    const newHabit = {
      userId,
      title, 
      payOut, 
      description, 
      frequency, 
      repeatable,
      cooldown, 
      emoji
    };

    const result = await activeHabits.insertOne(newHabit);
    return { status: 201, jsonBody: { id: result.insertedId, ...newHabit } };
  },
});