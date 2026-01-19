import { Router } from "express";
import { getPriceTrends } from "../services/price-trend.service.js";
import { ValidationError } from "../lib/errors.js";

export const priceTrendsRouter = Router();

/**
 * @openapi
 * /api/flights/price-trends:
 *   get:
 *     summary: Get price trends
 *     parameters:
 *       - name: searchId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Price trend buckets
 */

priceTrendsRouter.get("/price-trends", async (req, res) => {
  const searchId = req.query.searchId;

  if (typeof searchId !== "string" || !searchId) {
    throw new ValidationError("searchId is required");
  }

  const result = await getPriceTrends(searchId);
  res.status(200).json(result);
});
