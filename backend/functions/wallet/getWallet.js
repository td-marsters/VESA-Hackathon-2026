const { app } = require("@azure/functions");
const { ObjectId } = require("mongodb");
const { getDb } = require("../../../data/db");

app.http("getWallet", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "wallet/{userId}",
  handler: async (req, context) => {
    const { userId } = req.params;

    const db = await getDb();
    const wallet = await db.collection("Wallet").findOne({ userId: userId });

    if (!wallet) {
      return { status: 404, jsonBody: { error: "Wallet not found" } };
    }

    return { status: 200, jsonBody: wallet };
  },
});