/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { Test, TestingModule } from "@nestjs/testing";
import { ProductController } from "../../src/controllers/product.controller";
import { ProductService } from "../../src/services/product.service";
import { NotFoundException } from "@nestjs/common";

describe("ProductController", () => {
  let controller: ProductController;
  let service: jest.Mocked<ProductService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getProductById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get(ProductService);
  });

  it("should return a product", async () => {
    const product = { id: "1", name: "Test", source: "Postgres DB" };
    service.getProductById.mockResolvedValue(product as any);

    const result = await controller.getProductById({ id: "1" });

    expect(result.id).toBe("1");
  });

  it("should throw NotFoundException if product not found", async () => {
    service.getProductById.mockResolvedValue(null);

    await expect(controller.getProductById({ id: "1" })).rejects.toThrow(
      NotFoundException,
    );
  });
});
