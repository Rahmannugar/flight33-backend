import { cacheService } from "./cache.service.js";
import { NotFoundError } from "../lib/errors.js";

type PriceBucket = {
  label: "Morning" | "Afternoon" | "Evening";
  minPrice: number;
  avgPrice: number;
  maxPrice: number;
};

type PriceTrendResult = {
  searchId: string;
  currency: string;
  buckets: PriceBucket[];
};

const PRICE_TREND_TTL_SECONDS = 60 * 10;

function getBucketLabel(hour: number): PriceBucket["label"] | null {
  if (hour >= 5 && hour <= 11) return "Morning";
  if (hour >= 12 && hour <= 17) return "Afternoon";
  if (hour >= 18 && hour <= 23) return "Evening";
  return null;
}

export async function getPriceTrends(
  searchId: string
): Promise<PriceTrendResult> {
  const trendCacheKey = `flight33:price-trends:${searchId}`;
  const searchCacheKey = `flight33:search:${searchId}`;

  const cachedTrend =
    await cacheService.get<PriceTrendResult>(trendCacheKey);

  if (cachedTrend) {
    return cachedTrend;
  }

  const searchResult =
    await cacheService.get<any>(searchCacheKey);

  if (!searchResult) {
    throw new NotFoundError("Search result not found for price trends");
  }

  const bucketMap: Record<
    PriceBucket["label"],
    number[]
  > = {
    Morning: [],
    Afternoon: [],
    Evening: []
  };

  for (const flight of searchResult.flights) {
    const firstSegment = flight.segments[0];
    const hour = new Date(firstSegment.departureTime).getHours();
    const label = getBucketLabel(hour);

    if (label) {
      bucketMap[label].push(flight.price);
    }
  }

  const buckets: PriceBucket[] = Object.entries(bucketMap)
    .filter(([, prices]) => prices.length > 0)
    .map(([label, prices]) => {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice =
        prices.reduce((a, b) => a + b, 0) / prices.length;

      return {
        label: label as PriceBucket["label"],
        minPrice: Number(minPrice.toFixed(2)),
        avgPrice: Number(avgPrice.toFixed(2)),
        maxPrice: Number(maxPrice.toFixed(2))
      };
    });

  const result: PriceTrendResult = {
    searchId,
    currency: searchResult.meta.currency,
    buckets
  };

  await cacheService.set(trendCacheKey, result, {
    ttlSeconds: PRICE_TREND_TTL_SECONDS
  });

  return result;
}
