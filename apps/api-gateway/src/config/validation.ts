/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import * as Joi from "joi";

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().default(4000),
  JWT_SECRET: Joi.string().required(),
  OTEL_SERVICE_NAME: Joi.string().default("api-gateway"),
  JAEGER_HOST: Joi.string().default("localhost"),
  JAEGER_PORT: Joi.number().default(6832),
  KAFKA_BROKERS: Joi.string().default("localhost:9092"),
  KAFKA_CLIENT_ID: Joi.string().default("api-gateway"),
});
