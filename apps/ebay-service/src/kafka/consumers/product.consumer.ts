/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { Injectable, Logger } from "@nestjs/common";
import { KafkaMessage } from "kafkajs";
import { ProductService } from "../../services/product.service";

@Injectable()
export class ProductConsumer {
  constructor(
    private readonly productService: ProductService,
    private readonly logger: Logger = new Logger(ProductConsumer.name),
  ) {}

  /**
   * Handles the 'ebay.product.get' topic.
   *
   * @param {KafkaMessage} message - The incoming Kafka message.
   */
  async handleProductGet(message: KafkaMessage) {
    try {
      if (message.value === null) {
        this.logger.error("Kafka message value is null");
        return;
      }
      const { productId } = JSON.parse(message.value.toString());
      await this.productService.getProductById(productId);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Error processing Kafka message: ${err.message}, Message: ${message.value ? message.value.toString() : "null"}`,
      );
      // In a real application, you would send this to a Dead Letter Queue (DLQ)
    }
  }
}
