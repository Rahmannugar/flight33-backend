import { cacheService } from "./cache.service.js";
import { createSearchHash } from "../lib/search-hash.js";
import type { FlightSearchInput } from "../schemas/flight-search.schema.js";
import { amadeusGet } from "../lib/amadeus-client.js";

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

  const now = new Date();
const expiresAt = new Date(
  now.getTime() + SEARCH_CACHE_TTL_SECONDS * 1000
).toISOString();

const amadeusResponse = await amadeusGet<any>(
  "/v2/shopping/flight-offers",
  {
    originLocationCode: input.origin,
    destinationLocationCode: input.destination,
    departureDate: input.departureDate,
    returnDate: input.returnDate,
    adults: input.adults,
    travelClass: input.travelClass,
    currencyCode: "USD",
    max: 20
  }
);

const flights: Flight[] = amadeusResponse.data.map(
  (offer: any, index: number) => {
    const itinerary = offer.itineraries[0];
    const segments = itinerary.segments;

    const normalizedSegments: FlightSegment[] = segments.map(
      (seg: any) => ({
        from: seg.departure.iataCode,
        to: seg.arrival.iataCode,
        departureTime: seg.departure.at,
        arrivalTime: seg.arrival.at
      })
    );

    const durationMinutes =
      itinerary.duration
        .replace("PT", "")
        .replace("H", ":")
        .replace("M", "")
        .split(":")
        .reduce((acc: number, val: string, i: number) =>
          acc + Number(val) * (i === 0 ? 60 : 1),
        0);

    return {
      id: `${searchId}-${index}`,
      airline: {
        code: offer.validatingAirlineCodes[0],
        name: offer.validatingAirlineCodes[0]
      },
      price: Number(offer.price.total),
      stops: segments.length - 1,
      durationMinutes,
      segments: normalizedSegments
    };
  }
);

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
