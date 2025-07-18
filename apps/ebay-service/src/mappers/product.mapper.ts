/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { ProductEntity } from "../entities/product.entity";
import { GetProductByIdResponseDto } from "../dto/response/get-product-by-id.response.dto";
import { Product } from "../types/product.types";

export class ProductMapper {
  /**
   * Converts a ProductEntity to a GetProductByIdResponseDto.
   *
   * @param {ProductEntity} entity - The product entity from the database.
   * @param {'Redis Cache' | 'Postgres DB' | 'External eBay API'} source - The source of the data.
   * @returns {GetProductByIdResponseDto} The response DTO.
   */
  static toDto(
    entity: ProductEntity,
    source: "Redis Cache" | "Postgres DB" | "External eBay API",
  ): GetProductByIdResponseDto {
    const dto = new GetProductByIdResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.price = entity.price;
    dto.imageUrl = entity.imageUrl;
    dto.source = source;
    return dto;
  }

  /**
   * Converts a generic Product object to a ProductEntity.
   *
   * @param {Product} product - The product data, typically from an external source.
   * @returns {ProductEntity} The database entity.
   */
  static toEntity(product: Product): ProductEntity {
    const entity = new ProductEntity();
    entity.id = product.id;
    entity.name = product.name;
    entity.description = product.description;
    entity.price = product.price;
    entity.imageUrl = product.imageUrl;
    return entity;
  }
}
