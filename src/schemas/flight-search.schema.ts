import { z } from "zod";

const airportCode = z
  .string()
  .length(3)
  .transform((v) => v.toUpperCase());

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const flightSearchSchema = z
  .object({
    origin: airportCode,
    destination: airportCode,
    departureDate: isoDate,
    returnDate: isoDate.optional(),
    adults: z.number().int().min(1).max(9),
    travelClass: z.enum([
      "ECONOMY",
      "PREMIUM_ECONOMY",
      "BUSINESS",
      "FIRST"
    ])
  })
  .refine(
    (data) =>
      !data.returnDate ||
      new Date(data.returnDate) >= new Date(data.departureDate),
    {
      message: "returnDate must be after departureDate",
      path: ["returnDate"]
    }
  );

export type FlightSearchInput = z.infer<typeof flightSearchSchema>;
