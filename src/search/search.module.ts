import { Module } from "@nestjs/common";
import { SearchService } from "./search.service";
import { SearchController } from "./search.controller";
import { ElasticModule } from "../elastic/elastic.module";

@Module({
  imports: [ElasticModule],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
