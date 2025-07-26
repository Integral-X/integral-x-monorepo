/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { Module } from "@nestjs/common";
import { AuthModule as BaseAuthModule } from "@integral-x/auth";

@Module({
  imports: [BaseAuthModule],
})
export class AuthModule {}
