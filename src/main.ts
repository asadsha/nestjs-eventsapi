import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as env from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
env.config();

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const port = parseInt(process.env.PORT) || 3000;
  await app.listen(port);
  logger.log(`Application started on port ${port}`);
}
bootstrap();
