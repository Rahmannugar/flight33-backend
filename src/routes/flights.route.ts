import { Router } from "express";
import { flightSearchSchema } from "../schemas/flight-search.schema.js";
import { searchFlights } from "../services/flight-search.service.js";
import { ValidationError } from "../lib/errors.js";

export const flightsRouter = Router();

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
