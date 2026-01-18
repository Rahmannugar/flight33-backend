import { Router } from "express";
import { flightSearchSchema } from "../schemas/flight-search.schema.js";
import { searchFlights } from "../services/flight-search.service.js";
import { ValidationError } from "../lib/errors.js";

export const flightsRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     FlightSegment:
 *       type: object
 *       properties:
 *         from:
 *           type: string
 *           example: "LOS"
 *         to:
 *           type: string
 *           example: "JFK"
 *         departureTime:
 *           type: string
 *           example: "2026-02-10T08:10:00"
 *         arrivalTime:
 *           type: string
 *           example: "2026-02-10T19:15:00"
 *       required:
 *         - from
 *         - to
 *         - departureTime
 *         - arrivalTime
 *     Flight:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "cc09190c-0"
 *         airline:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: "AA"
 *             name:
 *               type: string
 *               example: "American Airlines"
 *           required:
 *             - code
 *             - name
 *         price:
 *           type: number
 *           example: 820.45
 *         stops:
 *           type: number
 *           example: 1
 *         durationMinutes:
 *           type: number
 *           example: 845
 *         segments:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/FlightSegment"
 *       required:
 *         - id
 *         - airline
 *         - price
 *         - stops
 *         - durationMinutes
 *         - segments
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: "VALIDATION_ERROR"
 *             message:
 *               type: string
 *               example: "Invalid flight search input"
 *             details:
 *               nullable: true
 *           required:
 *             - code
 *             - message
 *       required:
 *         - error
 */

/**
 * @openapi
 * /api/flights/search:
 *   post:
 *     summary: Search for flights
 *     description: Search for available flights between two airports using real-time pricing.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - origin
 *               - destination
 *               - departureDate
 *               - adults
 *               - travelClass
 *             properties:
 *               origin:
 *                 type: string
 *                 example: LOS
 *               destination:
 *                 type: string
 *                 example: JFK
 *               departureDate:
 *                 type: string
 *                 example: 2026-02-10
 *               returnDate:
 *                 type: string
 *                 example: 2026-02-20
 *               adults:
 *                 type: number
 *                 example: 1
 *               travelClass:
 *                 type: string
 *                 enum: [ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST]
 *     responses:
 *       200:
 *         description: Successful flight search
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                 flights:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flight'
 */

flightsRouter.post("/search", async (req, res) => {
  const parsed = flightSearchSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ValidationError(
      "Invalid flight search input",
      parsed.error.flatten()
    );
  }

  const result = await searchFlights(parsed.data);
  res.status(200).json(result);
});
