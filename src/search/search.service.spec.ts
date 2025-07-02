import { Test, TestingModule } from "@nestjs/testing";
import { SearchService } from "./search.service";
import { ElasticService } from "../elastic/elastic.service";
import { LRUCache } from "lru-cache";
import { ApiResponse } from "@elastic/elasticsearch";
import { Product } from "./domain/search.types";
import { SearchResponse } from "@elastic/elasticsearch/api/types";

describe("SearchService", () => {
  let service: SearchService;
  let mockCache: LRUCache<string, any>;
  let mockElasticService: Partial<ElasticService>;
  let mockClient: any;

  beforeEach(async () => {
    mockCache = new LRUCache({ max: 10 });
    mockClient = {
      search: jest.fn(),
    };
    mockElasticService = {
      getClient: () => mockClient,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        { provide: "LRU_CACHE", useValue: mockCache },
        { provide: ElasticService, useValue: mockElasticService },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it("should return cached result if available", async () => {
    mockCache.set("test", [{ title: "Cached Title", score: 1.0 }]);
    const result = await service.searchProducts("test");

    expect(result).toEqual([{ title: "Cached Title", score: 1.0 }]);
  });

  it("should query elasticsearch if cache is empty", async () => {
    const fakeESResponse: ApiResponse<SearchResponse<Product>> = {
      body: {
        hits: {
          total: { value: 1, relation: "eq" },
          hits: [
            {
              _score: 2.0,
              _source: {
                id: "1",
                title: "Elastic Product",
                description: "From ES",
              },
            },
          ],
        },
      },
    } as any;

    mockClient.search.mockResolvedValue(fakeESResponse);

    const result = await service.searchProducts("elastic");

    expect(mockClient.search).toHaveBeenCalled();
    expect(result).toEqual([
      {
        title: "Elastic Product",
        score: 2.0,
      },
    ]);
    expect(mockCache.get("elastic")).toEqual(result);
  });
});
