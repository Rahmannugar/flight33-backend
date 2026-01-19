import { Router } from "express";
import { searchLocations } from "../services/location.service.js";
import { ValidationError } from "../lib/errors.js";

export const locationsRouter = Router();

/**
 * @openapi
 * /api/locations/search:
 *   get:
 *     summary: Search for airports and cities
 *     parameters:
 *       - name: keyword
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of matching locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   iataCode:
 *                     type: string
 *                   address:
 *                     type: object
 *                     properties:
 *                       cityName:
 *                         type: string
 *                       countryName:
 *                         type: string
 * */
locationsRouter.get("/", async (req, res) => {
  const keyword = req.query.keyword;

  if (typeof keyword !== "string" || keyword.length < 2) {
    throw new ValidationError("Keyword must be at least 2 characters");
  }

  const results = await searchLocations(keyword);
  res.status(200).json(results);
});
