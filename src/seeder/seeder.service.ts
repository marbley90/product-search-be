import { Injectable, Logger } from "@nestjs/common";
import { ElasticService } from "../elastic/elastic.service";
import { faker } from "@faker-js/faker";
import { Client } from "@elastic/elasticsearch";

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly elasticService: ElasticService) {}

  async seedProducts(count = 1000): Promise<void> {
    const client = this.elasticService.getClient();

    await this.waitForElasticsearch(client);

    try {
      const { body: indexExists } = await client.indices.exists({
        index: "products",
      });
      if (!indexExists) {
        this.logger.log('Creating "products" index...');
        await client.indices.create({ index: "products" });
      }

      const { body: countResult } = await client.count({ index: "products" });
      if (countResult.count > 0) {
        this.logger.log(
          `Products index already has ${countResult.count} documents. Skipping seeding.`,
        );
        return;
      }

      this.logger.log(`Seeding ${count} products into Elasticsearch...`);

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

      if ((response.body as any).errors) {
        this.logger.error("Some errors occurred during seeding.");
      } else {
        this.logger.log(`Successfully seeded ${count} products.`);
      }
    } catch (error) {
      this.logger.error("Failed during seeding check or operation.", error);
      throw error;
    }
  }

  private async waitForElasticsearch(
    client: Client,
    retries = 10,
    delayMs = 2000,
  ): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await client.ping();
        this.logger.log("Elasticsearch is ready.");
        return;
      } catch {
        this.logger.warn(`Waiting for Elasticsearch... (${i + 1}/${retries})`);
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
    throw new Error("Elasticsearch not available after multiple attempts.");
  }
}
