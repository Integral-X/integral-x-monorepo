/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { HealthProducer } from "./messaging/health.producer";
import { MessagingModule } from "@integral-x/messaging";

@Module({
  imports: [MessagingModule],
  controllers: [HealthController],
  providers: [HealthProducer],
})
export class HealthModule {}
