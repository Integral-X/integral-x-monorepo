/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { ProductCacheService } from "../../src/cache/product.cache.service";
import { Product } from "../../src/types/product.types";
import { RedisClientType } from "redis";
import { ConfigService } from "@nestjs/config";

describe("ProductCacheService", () => {
  let cacheService: ProductCacheService;
  let redisClient: jest.Mocked<RedisClientType>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    redisClient = {
      get: jest.fn(),
      set: jest.fn(),
    } as unknown as jest.Mocked<RedisClientType>;

    configService = {
      get: jest.fn().mockReturnValue(3600), // Mock the TTL value
    } as unknown as jest.Mocked<ConfigService>;

    cacheService = new ProductCacheService(redisClient, configService);
  });

  it("should get a product from cache", async () => {
    const product: Product = {
      id: "1",
      name: "Test",
      description: "",
      price: 0,
      imageUrl: "",
      source: "Redis Cache",
    };
    redisClient.get.mockResolvedValue(JSON.stringify(product));

    const result = await cacheService.getProduct("1");
    expect(result).toEqual(product);
    expect(redisClient.get).toHaveBeenCalledWith("product:1");
  });

  it("should return null if product not in cache", async () => {
    redisClient.get.mockResolvedValue(null);

    const result = await cacheService.getProduct("1");
    expect(result).toBeNull();
  });

  it("should set a product in cache", async () => {
    const product: Product = {
      id: "1",
      name: "Test",
      description: "",
      price: 0,
      imageUrl: "",
      source: "Redis Cache",
    };
    await cacheService.setProduct(product);

    expect(redisClient.set).toHaveBeenCalledWith(
      "product:1",
      JSON.stringify(product),
      { EX: 3600 },
    );
  });
});
