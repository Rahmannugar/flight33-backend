import { cacheService } from "./cache.service.js";
import { createSearchHash } from "../lib/search-hash.js";
import type { FlightSearchInput } from "../schemas/flight-search.schema.js";

type FlightSegment = {
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
};

type Flight = {
  id: string;
  airline: {
    code: string;
    name: string;
  };
  price: number;
  stops: number;
  durationMinutes: number;
  segments: FlightSegment[];
};

type FlightSearchResult = {
  meta: {
    currency: string;
    searchId: string;
    cached: boolean;
    expiresAt: string;
  };
  flights: Flight[];
};

const SEARCH_CACHE_TTL_SECONDS = 60 * 10;

export async function searchFlights(
  input: FlightSearchInput
): Promise<FlightSearchResult> {
  const searchId = createSearchHash(input);
  const cacheKey = `flight33:search:${searchId}`;

  const cached = await cacheService.get<FlightSearchResult>(cacheKey);

  if (cached) {
    return {
      ...cached,
      meta: {
        ...cached.meta,
        cached: true
      }
    };
  }

  // ---- STUB DATA (to be replaced with Amadeus) ----

  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + SEARCH_CACHE_TTL_SECONDS * 1000
  ).toISOString();

  const flights: Flight[] = [
    {
      id: `${searchId}-0`,
      airline: {
        code: "AA",
        name: "American Airlines"
      },
      price: 820.45,
      stops: 1,
      durationMinutes: 845,
      segments: [
        {
          from: input.origin,
          to: "LHR",
          departureTime: `${input.departureDate}T08:10:00`,
          arrivalTime: `${input.departureDate}T14:30:00`
        },
        {
          from: "LHR",
          to: input.destination,
          departureTime: `${input.departureDate}T16:00:00`,
          arrivalTime: `${input.departureDate}T19:15:00`
        }
      ]
    }
  ];

  const result: FlightSearchResult = {
    meta: {
      currency: "USD",
      searchId,
      cached: false,
      expiresAt
    },
    flights
  };

  await cacheService.set(cacheKey, result, {
    ttlSeconds: SEARCH_CACHE_TTL_SECONDS
  });

  return result;
}
