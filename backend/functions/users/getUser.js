const { app } = require("@azure/functions");
const { ObjectId } = require("mongodb");
const { getDb } = require("../../../data/db");

app.http("getUser", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "user/{userId}",
  handler: async (req, context) => {
    const { userId } = req.params;
    const db = await getDb();

    let objectId;
    try {
      objectId = new ObjectId(userId);
    } catch {
      const user = await db.collection("users").findOne({ name: userId });
      if(user == undefined) {
        return { status: 400, jsonBody: { error: "Invalid user ID" } };
      }
      return { status: 200, jsonBody: user };

    }

    const user = await db.collection("users").findOne({ _id: objectId });
    
    return { status: 200, jsonBody: user };
  },
});