import { amadeusGet } from "../lib/amadeus-client.js";
import { cacheService } from "./cache.service.js";

export type LocationResult = {
  name: string;
  iataCode: string;
  address: {
    cityName: string;
    countryName: string;
  };
};

const LOCATION_CACHE_TTL = 60 * 60 * 24; // 24 hours

export async function searchLocations(keyword: string): Promise<LocationResult[]> {
  const cacheKey = `flight33:locations:${keyword.toLowerCase()}`;
  const cached = await cacheService.get<LocationResult[]>(cacheKey);

  if (cached) {
    return cached;
  }

  const response = await amadeusGet<any>("/v1/reference-data/locations", {
    subType: "AIRPORT,CITY",
    keyword,
    view: "LIGHT",
    "page[limit]": 10
  });

  const results: LocationResult[] = response.data.map((loc: any) => ({
    name: loc.name,
    iataCode: loc.iataCode,
    address: {
      cityName: loc.address?.cityName || loc.name,
      countryName: loc.address?.countryName || ""
    }
  }));

  await cacheService.set(cacheKey, results, { ttlSeconds: LOCATION_CACHE_TTL });

  return results;
}
