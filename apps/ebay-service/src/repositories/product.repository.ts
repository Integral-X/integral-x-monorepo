/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "../entities/product.entity";

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  /**
   * Finds a product by its ID.
   *
   * @param {string} id - The ID of the product to find.
   * @returns {Promise<ProductEntity | null>} The found product entity or null.
   */
  async findById(id: string): Promise<ProductEntity | null> {
    return this.productRepository.findOneBy({ id });
  }

  /**
   * Saves a product entity to the database.
   *
   * @param {ProductEntity} product - The product entity to save.
   * @returns {Promise<ProductEntity>} The saved product entity.
   */
  async save(product: ProductEntity): Promise<ProductEntity> {
    return this.productRepository.save(product);
  }
}
