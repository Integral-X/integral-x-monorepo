/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { ConfigService } from "@nestjs/config";
import { createClient } from "redis";

export const redisProvider = {
  provide: "REDIS_CLIENT",
  useFactory: async (configService: ConfigService) => {
    const client = createClient({
      socket: {
        host: configService.get<string>("REDIS_HOST") || "localhost",
        port: configService.get<number>("REDIS_PORT") || 6379,
      },
    });

    client.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    await client.connect();
    return client;
  },
  inject: [ConfigService],
};
