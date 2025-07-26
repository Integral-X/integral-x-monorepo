/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import * as Joi from "joi";

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().default(4100),
  DB_HOST: Joi.string().hostname().default("localhost"),
  DB_PORT: Joi.number().port().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SCHEMA: Joi.string().required(),
  KAFKA_BROKERS: Joi.string().default("localhost:9092"),
  KAFKA_CLIENT_ID: Joi.string().default("ebay-service"),
  REDIS_HOST: Joi.string().hostname().default("localhost"),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_CACHE_TTL_SECONDS: Joi.number().default(3600),
  EBAY_API_BASE_URL: Joi.string().uri().default("https://api.ebay.com"),
  EBAY_API_KEY: Joi.string().default("mock-api-key"),
});
