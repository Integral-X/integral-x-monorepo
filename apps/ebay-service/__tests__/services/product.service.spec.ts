/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { ProductService } from "../../src/services/product.service";
import { ProductRepository } from "../../src/repositories/product.repository";
import { ProductCacheService } from "../../src/cache/product.cache.service";
import { EbayApiAdapter } from "../../src/external/ebay-api.adapter";
import { ProductEntity } from "../../src/entities/product.entity";
import { Product } from "../../src/types/product.types";

describe("ProductService", () => {
  let service: ProductService;
  let repository: jest.Mocked<ProductRepository>;
  let cacheService: jest.Mocked<ProductCacheService>;
  let apiAdapter: jest.Mocked<EbayApiAdapter>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    cacheService = {
      getProduct: jest.fn(),
      setProduct: jest.fn(),
    } as unknown as jest.Mocked<ProductCacheService>;

    apiAdapter = {
      getProductById: jest.fn(),
    } as unknown as jest.Mocked<EbayApiAdapter>;

    service = new ProductService(repository, cacheService, apiAdapter);
  });

  it("should return product from cache", async () => {
    const product: Product = {
      id: "1",
      name: "Test",
      description: "",
      price: 0,
      imageUrl: "",
      source: "Redis Cache",
    };
    cacheService.getProduct.mockResolvedValue(product);

    const result = await service.getProductById("1");

    expect(result).toBeDefined();
    expect(result!.source).toBe("Redis Cache");
    expect(repository.findById).not.toHaveBeenCalled();
  });

  it("should return product from db if not in cache", async () => {
    const entity = new ProductEntity();
    entity.id = "1";
    cacheService.getProduct.mockResolvedValue(null);
    repository.findById.mockResolvedValue(entity);

    const result = await service.getProductById("1");

    expect(result).toBeDefined();
    expect(result!.source).toBe("Postgres DB");
    expect(cacheService.setProduct).toHaveBeenCalled();
    expect(apiAdapter.getProductById).not.toHaveBeenCalled();
  });

  it("should return product from external api if not in db or cache", async () => {
    const product: Product = {
      id: "1",
      name: "Test",
      description: "",
      price: 0,
      imageUrl: "",
      source: "External eBay API",
    };
    cacheService.getProduct.mockResolvedValue(null);
    repository.findById.mockResolvedValue(null);
    apiAdapter.getProductById.mockResolvedValue(product);

    const result = await service.getProductById("1");

    expect(result).toBeDefined();
    expect(result!.source).toBe("External eBay API");
    expect(repository.save).toHaveBeenCalled();
    expect(cacheService.setProduct).toHaveBeenCalled();
  });

  it("should return null if product not found anywhere", async () => {
    cacheService.getProduct.mockResolvedValue(null);
    repository.findById.mockResolvedValue(null);
    apiAdapter.getProductById.mockResolvedValue(null);

    const result = await service.getProductById("1");

    expect(result).toBeNull();
  });
});
