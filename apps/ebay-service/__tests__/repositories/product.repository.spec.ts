/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { ProductRepository } from "../../src/repositories/product.repository";
import { ProductEntity } from "../../src/entities/product.entity";
import { Repository } from "typeorm";

describe("ProductRepository", () => {
  let productRepository: ProductRepository;
  let typeormRepo: jest.Mocked<Repository<ProductEntity>>;

  beforeEach(() => {
    typeormRepo = {
      findOneBy: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<ProductEntity>>;
    productRepository = new ProductRepository(typeormRepo);
  });

  it("should find a product by id", async () => {
    const entity = new ProductEntity();
    typeormRepo.findOneBy.mockResolvedValue(entity);

    const result = await productRepository.findById("1");
    expect(result).toBe(entity);
    expect(typeormRepo.findOneBy).toHaveBeenCalledWith({ id: "1" });
  });

  it("should save a product", async () => {
    const entity = new ProductEntity();
    typeormRepo.save.mockResolvedValue(entity);

    const result = await productRepository.save(entity);
    expect(result).toBe(entity);
    expect(typeormRepo.save).toHaveBeenCalledWith(entity);
  });
});
