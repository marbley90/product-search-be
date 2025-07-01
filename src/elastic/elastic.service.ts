import { Injectable } from "@nestjs/common";
import { Client } from "@elastic/elasticsearch";
import { ConfigService } from "../common/config/config.service";

@Injectable()
export class ElasticService {
  private config = new ConfigService();
  private client = new Client({ node: this.config.elasticsearchUrl });

  getClient() {
    return this.client;
  }
}
