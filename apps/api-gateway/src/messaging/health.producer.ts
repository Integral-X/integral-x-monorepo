import { createProducer } from '../../../../libs/messaging/src/kafka';

const topic = 'health-checks';

export async function sendHealthCheck(status: string) {
  const producer = createProducer();
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify({ status, timestamp: new Date().toISOString() }) }],
  });
  await producer.disconnect();
} 