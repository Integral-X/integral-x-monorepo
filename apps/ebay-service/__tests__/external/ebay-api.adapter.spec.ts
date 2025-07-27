/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { EbayApiAdapter } from "../../src/external/ebay-api.adapter";
import { ConfigService } from "@nestjs/config";

describe("EbayApiAdapter", () => {
  let adapter: EbayApiAdapter;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    configService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === "EBAY_API_BASE_URL") return "https://api.ebay.com";
        if (key === "EBAY_API_KEY") return "mock-api-key";
        return "";
      }),
    } as unknown as jest.Mocked<ConfigService>;
    adapter = new EbayApiAdapter(configService);
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
