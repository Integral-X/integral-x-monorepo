import { Module } from '@nestjs/common';
import { HealthController } from '../health.controller';
import { HealthProducer } from '../messaging/health.producer';
import { MessagingModule } from '@integral-x/messaging';

@Module({
  imports: [MessagingModule],
  controllers: [HealthController],
  providers: [HealthProducer],
})
export class HealthModule {}
