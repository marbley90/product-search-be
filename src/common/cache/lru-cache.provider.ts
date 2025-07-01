import { LRUCache } from "lru-cache";

export const lruCacheProvider = {
  provide: "LRU_CACHE",
  useFactory: () => {
    return new LRUCache<string, any>({
      max: 10, // store top 10 most-used queries
    });
  },
};
