import { Injectable } from "@nestjs/common";
import { ElasticService } from "../elastic/elastic.service";
import { CreateProductDto } from "./dto/create-product.dto";

@Injectable()
export class ProductsService {
  constructor(private readonly elasticService: ElasticService) {}

  async indexProducts(products: CreateProductDto[]) {
    try {
      const client = this.elasticService.getClient();

      const body = products.flatMap((product) => [
        { index: { _index: "products" } },
        product,
      ]);

      const response = await client.bulk({ body, refresh: true });

      return {
        indexed: products.length,
        errors: response.body.errors,
      };
    } catch (error) {
      console.error(`Error during indexing products`, error);
      throw error;
    }
  }
}
