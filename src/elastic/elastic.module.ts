import { Module } from "@nestjs/common";
import { ConfigModule } from "../common/config/config.module";
import { ElasticService } from "./elastic.service";

@Module({
  imports: [ConfigModule],
  providers: [ElasticService],
  exports: [ElasticService],
})
export class ElasticModule {}
