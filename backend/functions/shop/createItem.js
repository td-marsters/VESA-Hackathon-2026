const { app } = require("@azure/functions");
const { getDb } = require("../../../data/db");
const Item = require("../../../data/models/Item");

app.http("createItem", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "item",
  handler: async (req, context) => {
    let body;
    try {
      body = await req.json();
    } catch {
      return { status: 400, jsonBody: { error: "Invalid JSON body" } };
    }

    const { title, cost, description} = body;
    if (!title || !cost) {
      return { status: 400, jsonBody: { error: "title/cost is required" } };
    }

    const db = await getDb();
    const habits = db.collection("Item");

    const existing = await habits.findOne({ title });
    if (existing) {
      return { status: 409, jsonBody: { error: "Item already exists" } };
    }

    const newItem = {
      title, 
      cost, 
      description
    };

    const result = await Item.insertOne(newItem);
    return { status: 201, jsonBody: { id: result.insertedId, ...newItem } };
  },
});