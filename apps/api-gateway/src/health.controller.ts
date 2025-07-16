import { Controller, Get } from '@nestjs/common';
import { HealthProducer } from './messaging/health.producer';

@Controller('health')
export class HealthController {
  constructor(private readonly healthProducer: HealthProducer) {}

  @Get()
  async getHealth() {
    await this.healthProducer.sendHealthCheck('ok');
    return { status: 'ok' };
  }
} 