const router = require("express").Router();

const mongoose = require("mongoose");
const redisConnection = require("../../models/db/redisConnection");
const { sendResponse } = require("../../utils/helpers");

async function getRedisClient() {
  return redisConnection.getClient();
}

// api health check
router.get("/ping", async (req, res) => {
  const data = {
    status: "OK",
    date: new Date(),
    database: "connected",
    redis: "connected",
  };

  let status_code = 200;
  let message = "Successful.";

  try {
    // check db connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error("database disconnected");
    }

    // check redis connection
    const redisClient = await getRedisClient();
    if (!redisClient) {
      throw new Error("redis disconnected");
    }

    const ping_redis = await redisClient.ping();

    if (ping_redis !== "PONG") {
      throw new Error("redis disconnected");
    }
  } catch (error) {
    status_code = 503;
    message = "Service Unavailable.";

    // determine which service failed
    if (error.message.includes("database") || error.code === "ECONNREFUSED") {
      message = "Database connection failed";
      data.database = "disconnected";
    }
    if (error.message.includes("redis") || error.code === "ENOTFOUND") {
      message = "Redis connection failed";
      data.redis = "disconnected";
    }
  }

  sendResponse(status_code, message, data)(req, res);
});

module.exports = router;
