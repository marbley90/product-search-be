import { Inject, Injectable } from "@nestjs/common";
import { LRUCache } from "lru-cache";
import { ElasticService } from "../elastic/elastic.service";
import { Product } from "./domain/search.types";
import { SearchResponse } from "@elastic/elasticsearch/api/types";
import { ApiResponse } from "@elastic/elasticsearch";

@Injectable()
export class SearchService {
  constructor(
    @Inject("LRU_CACHE") private readonly cache: LRUCache<string, any>,
    private readonly elasticService: ElasticService,
  ) {}

  async searchProducts(query: string) {
    const cached = this.cache.get(query);
    if (cached) return cached;

    const client = this.elasticService.getClient();

    try {
      const result: ApiResponse<SearchResponse<Product>> = await client.search({
        index: "products",
        body: {
          query: {
            multi_match: {
              // full-text keyword search over product titles and/or descriptions
              query,
              fields: ["title^2", "description"],
              fuzziness: "AUTO", // typo-tolerant search
            },
          },
        },
      });

      const hits = result.body.hits.hits.map((hit) => ({
        // return results sorted by relevance score
        title: hit._source?.title ?? "",
        score: hit._score,
      }));

      this.cache.set(query, hits);
      return hits;
    } catch (error) {
      console.error(`Error during searching products`, error);
      throw error;
    }
  }
}
