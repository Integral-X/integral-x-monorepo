import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger, logInfo } from '../../../libs/observability/src/logger';
import { getMetrics } from '../../../libs/observability/src/metrics';
import { initTracing } from '../../../libs/observability/src/tracing';
import * as express from 'express';
import { AllExceptionsFilter } from '../../../libs/common/src/http-exception.filter';
import { rateLimiter } from './rate-limit';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  initTracing(
    configService.get('OTEL_SERVICE_NAME') || 'api-gateway',
    configService.get('JAEGER_HOST') || 'localhost',
    configService.get('JAEGER_PORT') || 6832,
  );

  app.enableCors();
  app.use(rateLimiter);
  app.useGlobalFilters(new AllExceptionsFilter());

  // Correlation ID middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const correlationId = req.headers['x-correlation-id'] || uuidv4();
    (req as any).correlationId = correlationId;
    res.setHeader('x-correlation-id', correlationId);
    next();
  });

  // Request logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    logInfo(`Request: ${req.method} ${req.url}`, { correlationId: (req as any).correlationId });
    next();
  });

  // Prometheus metrics endpoint
  app.use('/metrics', async (req: Request, res: Response) => {
    res.set('Content-Type', 'text/plain');
    res.send(await getMetrics());
  });

  const port = configService.get('PORT') || 4000;
  await app.listen(port);
  logger.info(`API Gateway is running on: http://localhost:${port}`);
}
bootstrap(); 