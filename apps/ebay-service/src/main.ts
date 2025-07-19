/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { startHealthConsumer } from "./messaging/health.consumer";
import { ConfigService } from "@nestjs/config";
import { KafkaService } from "@integral-x/messaging";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const kafkaService = app.get(KafkaService);
  const port = configService.get("PORT");
  await app.listen(port);
  startHealthConsumer(kafkaService);
}

bootstrap();
