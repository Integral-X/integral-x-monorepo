/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { Injectable, Logger } from "@nestjs/common";
import { ProductRepository } from "../repositories/product.repository";
import { ProductCacheService } from "../cache/product.cache.service";
import { EbayApiAdapter } from "../external/ebay-api.adapter";
import { Product } from "../types/product.types";
import { ProductMapper } from "../mappers/product.mapper";

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cacheService: ProductCacheService,
    private readonly ebayApiAdapter: EbayApiAdapter,
    private readonly logger: Logger = new Logger(ProductService.name),
  ) {}

  /**
   * Gets a product by its ID, following the cache-database-external API pattern.
   *
   * @param {string} id - The ID of the product to get.
   * @returns {Promise<Product | null>} The product, if found.
   */
  async getProductById(id: string): Promise<Product | null> {
    // 1. Check Redis Cache
    let product = await this.cacheService.getProduct(id);
    if (product) {
      product.source = "Redis Cache";
      return product;
    }

    // 2. Check Postgres DB
    const productEntity = await this.productRepository.findById(id);
    if (productEntity) {
      product = { ...productEntity, source: "Postgres DB" };
      await this.cacheService.setProduct(product);
      return product;
    }

    // 3. Fetch from External eBay API
    product = await this.ebayApiAdapter.getProductById(id);
    if (product) {
      const newProductEntity = ProductMapper.toEntity(product);
      await this.productRepository.save(newProductEntity);
      await this.cacheService.setProduct(product);
      return product;
    }

    return null;
  }
}
