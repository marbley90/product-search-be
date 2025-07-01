import { Module } from "@nestjs/common";
import { ElasticModule } from "../elastic/elastic.module";
import { SeederService } from "./seeder.service";

@Module({
  imports: [ElasticModule],
  providers: [SeederService],
})
export class SeederModule {}
