import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startHealthConsumer } from './messaging/health.consumer';
import { ConfigService } from '@nestjs/config';
import { KafkaService } from '@integral-x/messaging';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const kafkaService = app.get(KafkaService);
  const port = configService.get('PORT');
  await app.listen(port);
  startHealthConsumer(kafkaService);
}

bootstrap(); 