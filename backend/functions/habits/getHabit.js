const { app } = require("@azure/functions");
const { getDb } = require("../../../data/db");

app.http("getHabits", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "habits/{habitId}",
  handler: async (req, context) => {
    const { habitId } = req.params;

    if (!userId) {
      return { status: 400, jsonBody: { error: "habitId is required" } };
    }

    const db = await getDb();
    const habits = await db.collection("activeHabits").find({ habitId }).toArray();

    return { status: 200, jsonBody: habits };
  },
});