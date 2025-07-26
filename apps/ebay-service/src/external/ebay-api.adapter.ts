/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { Injectable, Logger } from "@nestjs/common";
import { Product } from "../types/product.types";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EbayApiAdapter {
  private readonly ebayApiBaseUrl: string;
  private readonly ebayApiKey: string;

  private readonly logger = new Logger(EbayApiAdapter.name);

  constructor(private readonly configService: ConfigService) {
    this.ebayApiBaseUrl =
      this.configService.get<string>("EBAY_API_BASE_URL") ?? "";
    this.ebayApiKey = this.configService.get<string>("EBAY_API_KEY") ?? "";
  }

  /**
   * Fetches a product by its ID from the mock eBay API.
   *
   * @param {string} id - The ID of the product to fetch.
   * @returns {Promise<Product | null>} The fetched product or null.
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      // This is a mock implementation.
      // In a real application, you would make an HTTP request to the eBay API.
      this.logger.log(
        `Fetching product ${id} from external eBay API using URL: ${this.ebayApiBaseUrl} and API Key: ${this.ebayApiKey}...`,
      );

      if (id === "123") {
        return {
          id: "123",
          name: "Mock Product from eBay",
          description: "This is a mock product description.",
          price: 99.99,
          imageUrl: "https://example.com/mock-product.jpg",
          source: "External eBay API",
        };
      } else if (id === "error") {
        throw new Error("Simulated eBay API error");
      }

      return null;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error fetching product from eBay API: ${err.message}`);
      return null;
    }
  }
}
