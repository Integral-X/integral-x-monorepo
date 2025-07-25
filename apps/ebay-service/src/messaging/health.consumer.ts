/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { KafkaService } from "../../../../libs/messaging/src/kafka.service";
import { logger } from "../../../../libs/observability/src/logger";

export async function startHealthConsumer(kafkaService: KafkaService) {
  const consumer = kafkaService.createConsumer("ebay-health-group");
  await consumer.connect();
  await consumer.subscribe({ topic: "health-checks", fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      logger.info("Received health check", {
        value: message.value?.toString(),
      });
    },
  });
}
