import express from "express";
import "dotenv/config"
import { connectRedis, redisClient } from "./lib/redis-client.js";
import { errorHandler } from "./middleware/error-handler.js";
import { flightsRouter } from "./routes/flights.route.js";
import { priceTrendsRouter } from "./routes/price-trends.route.js";



const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(express.json());
app.use("/api/flights", flightsRouter);
app.use("/api/flights/price-trends", priceTrendsRouter);
app.use(errorHandler);

app.get("/health", (_req, res) => {
   const redisStatus = redisClient.isOpen ? "connected" : "disconnected";

  res.status(200).json({
    status: "ok",
    app: "Flight33",
    redis: redisStatus
  });
});

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