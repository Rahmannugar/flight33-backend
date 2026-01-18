import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectRedis, redisClient } from "./lib/redis-client.js";
import { errorHandler } from "./middleware/error-handler.js";
import { flightsRouter } from "./routes/flights.route.js";
import { priceTrendsRouter } from "./routes/price-trends.route.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./lib/swagger.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://flight33.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/flights", flightsRouter);
app.use("/api/flights/price-trends", priceTrendsRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    app: "Flight33",
    redis: redisClient.isOpen ? "connected" : "disconnected",
  });
});

app.use(errorHandler);

async function start() {
  app.listen(port, () => {
    console.log(`Flight33 API running on port ${port}`);
  });

  try {
    await connectRedis();
    console.log("Redis connected");
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
}

start().catch((err) => {
  console.error("Startup failure:", err);
  process.exit(1);
});
