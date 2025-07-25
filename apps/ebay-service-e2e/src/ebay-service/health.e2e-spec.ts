/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import request from "supertest";
import { INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { HealthModule } from "ebay-service/modules/health.module";

import { ConfigModule } from "@nestjs/config";

jest.mock("@nestjs/typeorm", () => ({
  TypeOrmModule: {
    forRootAsync: jest.fn(() => ({})),
    forRoot: jest.fn(() => ({})),
  },
}));

jest.mock("@integral-x/messaging", () => ({
  KafkaService: jest.fn().mockImplementation(() => ({
    createProducer: jest.fn().mockReturnValue({
      connect: jest.fn(),
      send: jest.fn(),
      disconnect: jest.fn(),
    }),
    createConsumer: jest.fn().mockReturnValue({
      connect: jest.fn(),
      subscribe: jest.fn(),
      run: jest.fn(),
      disconnect: jest.fn(),
    }),
  })),
}));

@Module({
  imports: [HealthModule, ConfigModule.forRoot({ isGlobal: true })],
})
class TestAppModule {}

describe("Health Check (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/health (GET)", () => {
    return request(app.getHttpServer())
      .get("/health")
      .expect(200)
      .expect({ status: "ok" });
  });

  afterAll(async () => {
    await app.close();
  });
});
