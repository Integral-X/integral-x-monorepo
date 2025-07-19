/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { Kafka, Producer, ProducerRecord } from "kafkajs";
import { ConfigService } from "@nestjs/config";
import { Product } from "../../types/product.types";

@Injectable()
export class ProductProducer implements OnModuleInit {
  private readonly kafka: Kafka;
  private readonly producer: Producer;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger = new Logger(ProductProducer.name),
  ) {
    this.kafka = new Kafka({
      clientId: this.configService.get<string>("KAFKA_CLIENT_ID"),
      brokers: (this.configService.get<string>("KAFKA_BROKERS") ?? "").split(
        ",",
      ),
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  /**
   * Produces a message to a Kafka topic.
   *
   * @param {ProducerRecord} record - The record to produce.
   */
  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }

  /**
   * Emits an 'ebay.product.persisted' event.
   *
   * @param {Product} productData - The data of the persisted product.
   */
  async emitProductPersisted(productData: Product) {
    await this.produce({
      topic: "ebay.product.persisted",
      messages: [{ value: JSON.stringify(productData) }],
    });
  }
}
