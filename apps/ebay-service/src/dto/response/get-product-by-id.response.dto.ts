/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { Product } from "../../types/product.types";

export class GetProductByIdResponseDto implements Product {
  /**
   * The unique identifier for the product.
   * @example "12345"
   */
  id!: string;

  /**
   * The name or title of the product.
   * @example "Vintage Leather Jacket"
   */
  name!: string;

  /**
   * A detailed description of the product.
   */
  description!: string;

  /**
   * The price of the product.
   */
  price!: number;

  /**
   * The URL of the product's image.
   */
  imageUrl!: string;

  /**
   * The source from which the product data was fetched.
   * @example "Redis Cache"
   */
  source!: "Redis Cache" | "Postgres DB" | "External eBay API";
}
