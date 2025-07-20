/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { Module } from "@nestjs/common";
import { HealthController } from "../controllers/health.controller";

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
