import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { Counter, collectDefaultMetrics, register } from 'prom-client';

collectDefaultMetrics();
const healthCheckCounter = new Counter({
  name: 'health_check_requests_total',
  help: 'Total number of health check requests',
});

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    healthCheckCounter.inc();
    return { status: 'ok' };
  }

  @Get('/metrics')
  async getMetrics(@Res() res: Response) {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  }
} 