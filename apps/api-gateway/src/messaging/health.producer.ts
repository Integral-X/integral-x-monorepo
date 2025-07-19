/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { Injectable } from "@nestjs/common";
import { KafkaService } from "../../../../libs/messaging/src";

const topic = "health-checks";

@Injectable()
export class HealthProducer {
  constructor(private readonly kafkaService: KafkaService) {}

  async sendHealthCheck(status: string) {
    // In a test environment, we might not have Kafka running.
    // We can mock the producer to prevent connection errors.
    if (process.env.NODE_ENV === "test") {
      console.log("Mocking Kafka producer in test environment");
      return;
    }

    const producer = this.kafkaService.createProducer();
    await producer.connect();
    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify({
            status,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
    await producer.disconnect();
  }
}
