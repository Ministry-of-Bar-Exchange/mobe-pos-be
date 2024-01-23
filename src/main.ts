import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';

import { AppModule } from './app.module';
import * as dotenv from 'dotenv'

async function bootstrap() {
  dotenv.config()
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  await app.listen(6800);

//  const pass=  await bcrypt.hash('12345', 10);
  // console.debug({ pass });
}
bootstrap();
