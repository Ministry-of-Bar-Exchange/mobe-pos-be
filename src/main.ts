import { NestFactory } from "@nestjs/core";
import * as bcrypt from "bcrypt";

import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  // Swagger Configuration
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle("Mobe-POS API")
    .setDescription("API description")
    .setVersion("1.0")
    .addBearerAuth(
      {
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: "Authorization",
        bearerFormat: "Bearer", // I`ve tested not to use this field, but the result was the same
        scheme: "Bearer",
        type: "http",
        in: "Header",
      },
      "access-token" 
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(6800);

  //  const pass=  await bcrypt.hash('12345', 10);
  // console.debug({ pass });
}
bootstrap();
