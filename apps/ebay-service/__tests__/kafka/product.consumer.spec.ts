/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { ProductConsumer } from "../../src/kafka/consumers/product.consumer";
import { ProductService } from "../../src/services/product.service";
import { KafkaMessage } from "kafkajs";

describe("ProductConsumer", () => {
  let consumer: ProductConsumer;
  let service: jest.Mocked<ProductService>;

  beforeEach(() => {
    service = {
      getProductById: jest.fn(),
    } as any;
    consumer = new ProductConsumer(service);
  });

  it("should call product service with product id", async () => {
    const message: KafkaMessage = {
      value: Buffer.from(JSON.stringify({ productId: "123" })),
      key: null,
      timestamp: Date.now().toString(),
      attributes: 0,
      offset: "0",
      headers: {},
    };

    await consumer.handleProductGet(message);

    expect(service.getProductById).toHaveBeenCalledWith("123");
  });
});
