import { Module } from "@nestjs/common";
import { SearchModule } from "./search/search.module";
import { ProductsModule } from "./products/products.module";
import { ElasticModule } from "./elastic/elastic.module";
import { CacheModule } from "./common/cache/cache.module";
import { ConfigModule } from "./common/config/config.module";

@Module({
  imports: [
    CacheModule,
    ElasticModule,
    ProductsModule,
    SearchModule,
    ConfigModule,
  ],
})
export class AppModule {}
