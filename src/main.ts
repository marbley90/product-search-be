import { NestFactory } from "@nestjs/core";
import { SeederService } from "./seeder/seeder.service";
import { SeederModule } from "./seeder/seeder.module";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const seederApp = await NestFactory.createApplicationContext(SeederModule);
  const seeder = seederApp.get(SeederService);
  await seeder.seedProducts(1000);
  await seederApp.close();

  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("Product Search API")
    .setDescription("API for full-text product search")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  await app.listen(3001);

  console.log(`🚀 Application is running on: http://localhost:3001`);
  console.log(
    `📖 Swagger API documentation is available at: http://localhost:3001/api`,
  );
}
bootstrap();
