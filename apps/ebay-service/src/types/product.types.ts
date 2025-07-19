/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
/**
 * @file Defines the core Product interface.
 * @author mahiuddinalkamal
 */

/**
 * Represents a product in the system.
 * This interface is used consistently across services and internal logic
 * to ensure type safety and a standardized data structure.
 */
export interface Product {
  /**
   * The unique identifier for the product.
   * @example "12345"
   */
  id: string;

  /**
   * The name or title of the product.
   * @example "Vintage Leather Jacket"
   */
  name: string;

  /**
   * A detailed description of the product.
   */
  description: string;

  /**
   * The price of the product.
   */
  price: number;

  /**
   * The URL of the product's image.
   */
  imageUrl: string;

  /**
   * The source from which the product data was fetched.
   * This is useful for debugging and understanding the data's origin.
   * @example "Redis Cache", "Postgres DB", "External eBay API"
   */
  source: "Redis Cache" | "Postgres DB" | "External eBay API";
}
