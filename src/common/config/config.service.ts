import { Injectable } from "@nestjs/common";
import * as process from "node:process";

@Injectable()
export class ConfigService {
  readonly _elasticsearchUrl: string;

  constructor() {
    this._elasticsearchUrl =
      process.env.ELASTICSEARCH_NODE ?? "http://localhost:9200";
  }

  get elasticsearchUrl() {
    return this._elasticsearchUrl;
  }
}
