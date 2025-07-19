/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { ProductMapper } from "../../src/mappers/product.mapper";
import { ProductEntity } from "../../src/entities/product.entity";
import { GetProductByIdResponseDto } from "../../src/dto/response/get-product-by-id.response.dto";
import { Product } from "../../src/types/product.types";

describe("ProductMapper", () => {
  it("should map ProductEntity to GetProductByIdResponseDto", () => {
    const entity = new ProductEntity();
    entity.id = "1";
    entity.name = "Test Product";
    entity.description = "Test Description";
    entity.price = 100;
    entity.imageUrl = "test.jpg";

    const dto = ProductMapper.toDto(entity, "Postgres DB");

    expect(dto).toBeInstanceOf(GetProductByIdResponseDto);
    expect(dto.id).toBe(entity.id);
    expect(dto.name).toBe(entity.name);
    expect(dto.source).toBe("Postgres DB");
  });

  it("should map Product to ProductEntity", () => {
    const product: Product = {
      id: "1",
      name: "Test Product",
      description: "Test Description",
      price: 100,
      imageUrl: "test.jpg",
      source: "External eBay API",
    };

    const entity = ProductMapper.toEntity(product);

    expect(entity).toBeInstanceOf(ProductEntity);
    expect(entity.id).toBe(product.id);
    expect(entity.name).toBe(product.name);
  });
});
