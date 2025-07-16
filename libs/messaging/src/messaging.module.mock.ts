import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';

class MockKafkaService {
  createProducer() {
    return {
      connect: jest.fn(),
      send: jest.fn(),
      disconnect: jest.fn(),
    };
  }

  createConsumer() {
    return {
      connect: jest.fn(),
      subscribe: jest.fn(),
      run: jest.fn(),
      disconnect: jest.fn(),
    };
  }
}

@Module({
  providers: [
    {
      provide: KafkaService,
      useClass: MockKafkaService,
    },
  ],
  exports: [KafkaService],
})
export class MockMessagingModule {}