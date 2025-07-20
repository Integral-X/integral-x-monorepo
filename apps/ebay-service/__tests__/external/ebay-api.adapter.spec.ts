/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { EbayApiAdapter } from "../../src/external/ebay-api.adapter";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

describe("EbayApiAdapter", () => {
  let adapter: EbayApiAdapter;
  let configService: jest.Mocked<ConfigService>;
  let logger: jest.Mocked<Logger>;

  beforeEach(() => {
    configService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === "EBAY_API_BASE_URL") return "https://api.ebay.com";
        if (key === "EBAY_API_KEY") return "mock-api-key";
        return "";
      }),
    } as unknown as jest.Mocked<ConfigService>;
    logger = {
      log: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<Logger>;
    adapter = new EbayApiAdapter(configService, logger);
  });

  it("should return a mock product for a valid ID", async () => {
    const product = await adapter.getProductById("123");
    expect(product).toBeDefined();
    if (product) {
      expect(product.id).toBe("123");
      expect(product.source).toBe("External eBay API");
    }
  });

  it("should return null for an invalid ID", async () => {
    const product = await adapter.getProductById("999");
    expect(product).toBeNull();
  });
});
