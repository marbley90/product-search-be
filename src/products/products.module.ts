import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { ElasticModule } from "../elastic/elastic.module";

@Module({
  imports: [ElasticModule],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
