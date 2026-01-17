import express from "express";
import "dotenv/config"
import { connectRedis, redisClient } from "./lib/redis.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(express.json());

app.get("/health", (_req, res) => {
   const redisStatus = redisClient.isOpen ? "connected" : "disconnected";

  res.status(200).json({
    status: "ok",
    app: "Flight33",
    redis: redisStatus
  });
});

app.use(errorHandler);

async function start() {
  await connectRedis();

  app.listen(port, () => {
    console.log(`Flight33 API running on port ${port}`);
  });
}

start().catch((err) => {
  console.error("Startup failure:", err);
  process.exit(1);
});