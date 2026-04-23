const IORedis = require("ioredis");

const redisPort = Number(process.env.REDIS_PORT || 6379);

const connection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number.isNaN(redisPort) ? 6379 : redisPort,
  maxRetriesPerRequest: null
});

connection.on("connect", () => console.log("Redis connected"));
connection.on("error", (error) => console.error("Redis error:", error.message));

module.exports = connection;
