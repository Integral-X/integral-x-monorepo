export class KafkaService {
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
