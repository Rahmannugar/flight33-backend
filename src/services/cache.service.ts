import { redisClient } from "../lib/redis.js";

type CacheSetOptions = {
  ttlSeconds: number;
};

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redisClient.get(key);

      if (!value) {
        console.info("[cache_miss]", key);
        return null;
      }

      console.info("[cache_hit]", key);
      return JSON.parse(value) as T;
    } catch (err) {
      console.error("[cache_error][get]", key, err);
      return null;
    }
  }

  async set<T>(key: string, value: T, options: CacheSetOptions): Promise<void> {
    try {
      await redisClient.set(key, JSON.stringify(value), {
        EX: options.ttlSeconds
      });
    } catch (err) {
      console.error("[cache_error][set]", key, err);
    }
  }
}

export const cacheService = new CacheService();
