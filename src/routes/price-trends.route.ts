import { Router } from "express";
import { getPriceTrends } from "../services/price-trend.service.js";
import { ValidationError } from "../lib/errors.js";

export const priceTrendsRouter = Router();

priceTrendsRouter.get("/", async (req, res) => {
  const searchId = req.query.searchId;

  if (typeof searchId !== "string" || !searchId) {
    throw new ValidationError("searchId is required");
  }

  const result = await getPriceTrends(searchId);
  res.status(200).json(result);
});
