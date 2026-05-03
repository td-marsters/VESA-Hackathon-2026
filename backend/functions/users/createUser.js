const { app } = require("@azure/functions");
const { getDb } = require("../../../data/db");

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

    const { name, habits } = body;
    if (!name) {
      return { status: 400, jsonBody: { error: "name is required" } };
    }

    const db = await getDb();
    const users = db.collection("users");

    const existing = await users.findOne({ name });
    if (existing) {
      return { status: 409, jsonBody: { error: "User already exists" } };
    }

    const newUser = { name, habits:[] };
    const result = await users.insertOne(newUser);

    return { 
      status: 201, 
      jsonBody: { 
        id: result.insertedId.toString(),
        name,
        habits
      }
    };
  },
});