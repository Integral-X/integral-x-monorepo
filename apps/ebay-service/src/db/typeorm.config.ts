/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: "postgres",
  host: configService.get<string>("DB_HOST"),
  port: configService.get<number>("DB_PORT"),
  username: configService.get<string>("DB_USER"),
  password: configService.get<string>("DB_PASS"),
  database: configService.get<string>("DB_NAME"),
  schema: configService.get<string>("DB_SCHEMA"),
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: true, // Set to false in production
});
