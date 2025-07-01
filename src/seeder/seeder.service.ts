import { Injectable, Logger } from "@nestjs/common";
import { ElasticService } from "../elastic/elastic.service";
import { faker } from "@faker-js/faker";

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly elasticService: ElasticService) {}

  async seedProducts(count = 1000): Promise<void> {
    this.logger.log(`Seeding ${count} products into Elasticsearch...`);

    const client = this.elasticService.getClient();

    const bulkBody: Array<Record<string, any>> = [];

    for (let i = 0; i < count; i++) {
      const product = {
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
      };

      bulkBody.push({ index: { _index: "products" } });
      bulkBody.push(product);
    }

    const response = await client.bulk({ body: bulkBody, refresh: true });

    const body = response.body as { errors?: boolean };

    if (body.errors) {
      this.logger.error("Some errors occurred during seeding.");
    } else {
      this.logger.log(`Successfully seeded ${count} products.`);
    }
  }
}
