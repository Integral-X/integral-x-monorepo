import { Controller, Get } from '@nestjs/common';
import { sendHealthCheck } from './messaging/health.producer';

@Controller('health')
export class HealthController {
  @Get()
  async getHealth() {
    await sendHealthCheck('ok');
    return { status: 'ok' };
  }
} 