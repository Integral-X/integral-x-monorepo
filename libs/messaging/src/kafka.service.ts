import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer, KafkaConfig } from 'kafkajs';

@Injectable()
export class KafkaService {
  private kafka: Kafka;

  constructor(private readonly configService: ConfigService) {
    const brokersString = this.configService.get<string>('KAFKA_BROKERS');
    const brokers = brokersString ? brokersString.split(',') : [];
    const clientId = this.configService.get<string>('KAFKA_CLIENT_ID');

    const kafkaConfig: KafkaConfig = { clientId, brokers };
    this.kafka = new Kafka(kafkaConfig);
  }

  createProducer(): Producer {
    return this.kafka.producer();
  }

  createConsumer(groupId: string): Consumer {
    return this.kafka.consumer({ groupId });
  }
} 