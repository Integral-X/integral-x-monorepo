/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
export const createClient = jest.fn(() => ({
  connect: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  on: jest.fn(),
}));

export type RedisClientType = ReturnType<typeof createClient>;
