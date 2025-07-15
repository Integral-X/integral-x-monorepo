import { Kafka, Producer, Consumer, KafkaConfig } from 'kafkajs';

const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
const clientId = process.env.KAFKA_CLIENT_ID || 'integral-x';

const kafkaConfig: KafkaConfig = { clientId, brokers };
const kafka = new Kafka(kafkaConfig);

export function createProducer(): Producer {
  return kafka.producer();
}

export function createConsumer(groupId: string): Consumer {
  return kafka.consumer({ groupId });
} 