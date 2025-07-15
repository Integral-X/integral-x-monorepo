import { createConsumer } from '../../../../libs/messaging/src/kafka';
import { logger } from '../../../../libs/observability/src/logger';

export async function startHealthConsumer() {
  const consumer = createConsumer('ebay-health-group');
  await consumer.connect();
  await consumer.subscribe({ topic: 'health-checks', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      logger.info('Received health check', { value: message.value?.toString() });
    },
  });
} 