const { app } = require("@azure/functions");
const { getDb } = require("../../../data/db");
const mongoose = require("mongoose");

app.http("getWallet", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "wallet/{userId}",
  handler: async (req, context) => {
    const { userId } = req.params;

    const db = await getDb();
    const wallet = await db.collection("wallets").findOne({ 
      userId: new mongoose.Types.ObjectId(userId)  // convert string to ObjectId
    });

    if (!wallet) {
      return { status: 404, jsonBody: { error: "Wallet not found" } };
    }

    return { status: 200, jsonBody: wallet };
  },
});