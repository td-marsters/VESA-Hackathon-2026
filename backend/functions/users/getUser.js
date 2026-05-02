const { app } = require("@azure/functions");
const { ObjectId } = require("mongodb");
const { getDb } = require("../../../data/db");

app.http("getUser", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "user/{userId}",
  handler: async (req, context) => {
    const { userId } = req.params;

    let objectId;
    try {
      objectId = new ObjectId(userId);
    } catch {
      return { status: 400, jsonBody: { error: "Invalid user ID" } };
    }

    const db = await getDb();
    const user = await db.collection("User").findOne({ _id: objectId });

    if (!user) {
      return { status: 404, jsonBody: { error: "User not found" } };
    }

    return { status: 200, jsonBody: user };
  },
});