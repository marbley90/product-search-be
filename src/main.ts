import { NestFactory } from "@nestjs/core";
import { SeederService } from "./seeder/seeder.service";
import { SeederModule } from "./seeder/seeder.module";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);
  const seeder = app.get(SeederService);
  await seeder.seedProducts(1000);
  await app.close();
}
bootstrap();
