import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startHealthConsumer } from './messaging/health.consumer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4100);
  startHealthConsumer();
}

bootstrap(); 