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

    const { userId, title, payOut, description, frequency, repeatable, cooldown, emoji} = body;

    const db = await getDb();
    const habits = db.collection("activehabits");


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

    const result = await habits.insertOne(newHabit);
    return { status: 201, jsonBody: { id: result._id, ...newHabit } };
  },
});