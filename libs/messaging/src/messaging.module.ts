import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { KafkaService } from './kafka.service';

export const validationSchema = Joi.object({
  KAFKA_BROKERS: Joi.string().default('localhost:9092'),
  KAFKA_CLIENT_ID: Joi.string().default('integral-x'),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? [] : '.env',
      isGlobal: true,
      validationSchema,
    }),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class MessagingModule {}
