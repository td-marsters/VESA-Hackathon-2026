const { app } = require("@azure/functions");
const { getDb } = require("../../../data/db");
const user = require("../../../data/models/user");

app.http("createUser", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "user",
  handler: async (req, context) => {
    let body;
    try {
      body = await req.json();
    } catch {
      return { status: 400, jsonBody: { error: "Invalid JSON body" } };
    }

    const { name, age } = body;
    if (!name) {
      return { status: 400, jsonBody: { error: "name is required" } };
    }

    const db = await getDb();
    const users = db.collection("User");

    const existing = await users.findOne({ name });
    if (existing) {
      return { status: 409, jsonBody: { error: "User already exists" } };
    }

    const newUser = {
      name,
      age
    };

    const result = await user.insertOne(newUser);
    return { status: 201, jsonBody: { id: result.insertedId, ...newUser } };
  },
});