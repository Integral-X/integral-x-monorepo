/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { Injectable, Inject } from "@nestjs/common";
import { Product } from "../types/product.types";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ProductCacheService {
  private readonly cacheTtl: number;

  constructor(
    @Inject("REDIS_CLIENT") private readonly redisClient: any,
    private readonly configService: ConfigService,
  ) {
    this.cacheTtl =
      this.configService.get<number>("REDIS_CACHE_TTL_SECONDS") ?? 3600;
  }

  /**
   * Retrieves a product from the Redis cache by its ID.
   *
   * @param {string} id - The ID of the product.
   * @returns {Promise<Product | null>} The cached product or null.
   */
  async getProduct(id: string): Promise<Product | null> {
    const product = await this.redisClient.get(`product:${id}`);
    return product ? JSON.parse(product) : null;
  }

  /**
   * Caches a product in Redis.
   *
   * @param {Product} product - The product to cache.
   * @returns {Promise<void>}
   */
  async setProduct(product: Product): Promise<void> {
    await this.redisClient.set(
      `product:${product.id}`,
      JSON.stringify(product),
      {
        EX: this.cacheTtl,
      },
    );
  }
}
