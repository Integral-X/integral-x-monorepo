import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger, logInfo } from '../../../libs/observability/src/logger';
import { getMetrics } from '../../../libs/observability/src/metrics';
import { initTracing } from '../../../libs/observability/src/tracing';
import * as express from 'express';
import { AllExceptionsFilter } from '../../../libs/common/src/http-exception.filter';
import { rateLimiter } from './rate-limit';
import { v4 as uuidv4 } from 'uuid';

async function bootstrap() {
  initTracing();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(rateLimiter);
  app.useGlobalFilters(new AllExceptionsFilter());

  // Correlation ID middleware
  app.use((req, res, next) => {
    const correlationId = req.headers['x-correlation-id'] || uuidv4();
    req.correlationId = correlationId;
    res.setHeader('x-correlation-id', correlationId);
    next();
  });

  // Request logging middleware
  app.use((req, res, next) => {
    logInfo(`Request: ${req.method} ${req.url}`, { correlationId: req.correlationId });
    next();
  });

  // Prometheus metrics endpoint
  app.use('/metrics', async (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(await getMetrics());
  });

  await app.listen(4000);
  logger.info(`API Gateway is running on: http://localhost:4000`);
}
bootstrap(); 