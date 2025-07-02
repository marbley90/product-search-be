import { Test, TestingModule } from "@nestjs/testing";
import { ProductsService } from "./products.service";
import { ElasticService } from "../elastic/elastic.service";
import { CreateProductDto } from "./dto/create-product.dto";

describe("ProductsService", () => {
  let service: ProductsService;
  let mockClient: any;

  beforeEach(async () => {
    mockClient = {
      bulk: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ElasticService,
          useValue: {
            getClient: () => mockClient,
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it("should index products and return result", async () => {
    const products: CreateProductDto[] = [
      { id: "1", title: "Test Product", description: "Description" },
    ];

    mockClient.bulk.mockResolvedValue({
      body: {
        errors: false,
      },
    });

    const result = await service.indexProducts(products);

    expect(mockClient.bulk).toHaveBeenCalledWith({
      body: [
        { index: { _index: "products" } },
        { id: "1", title: "Test Product", description: "Description" },
      ],
      refresh: true,
    });

    expect(result).toEqual({
      indexed: 1,
      errors: false,
    });
  });

  it("should throw error if indexing fails", async () => {
    const products: CreateProductDto[] = [
      { id: "2", title: "Fail Product", description: "Error" },
    ];

    mockClient.bulk.mockRejectedValue(new Error("Elasticsearch error"));

    await expect(service.indexProducts(products)).rejects.toThrow(
      "Elasticsearch error",
    );
  });
});
