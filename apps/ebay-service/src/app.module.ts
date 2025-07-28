/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HealthModule } from "./modules/health.module";
import { ProductModule } from "./modules/product.module";
import { MessagingModule } from "@integral-x/messaging";
import { validationSchema } from "./config/validation";
import { getTypeOrmConfig } from "./db/typeorm.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === "test" ? [] : ".env",
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        getTypeOrmConfig(configService),
      inject: [ConfigService],
    }),
    MessagingModule,
    HealthModule,
    ProductModule,
  ],
})
export class AppModule {}
