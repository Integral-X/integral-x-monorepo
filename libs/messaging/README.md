# Messaging Library

Event-driven messaging utilities for the Integral-X monorepo, providing KafkaJS-based messaging services, producers, consumers, and testing utilities for reliable inter-service communication.

[![Library](https://img.shields.io/badge/type-library-blue)](https://github.com/integral-x/integral-x-monorepo)
[![Kafka](https://img.shields.io/badge/messaging-Kafka-orange)](https://kafka.apache.org/)
[![NestJS](https://img.shields.io/badge/framework-NestJS-red)](https://nestjs.com/)

---

## 🚀 Quick Start

### Installation

```bash
# Library is automatically available in the monorepo
import { MessagingModule, KafkaService } from '@integral-x/messaging';
```

### Basic Usage

```typescript
// In your NestJS module
import { MessagingModule } from "@integral-x/messaging";

@Module({
  imports: [MessagingModule],
  // ...
})
export class YourModule {}

// In your service
import { KafkaService } from "@integral-x/messaging";

@Injectable()
export class YourService {
  constructor(private readonly kafkaService: KafkaService) {}

  async sendMessage(topic: string, message: any) {
    const producer = this.kafkaService.createProducer();
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    await producer.disconnect();
  }
}
```

---

## 🏗️ Library Structure

### Directory Layout

```
libs/messaging/
├── src/
│   ├── kafka.service.ts       # KafkaJS wrapper service
│   ├── messaging.module.ts    # NestJS messaging module
│   ├── index.ts              # Library exports
│   └── __mocks__/
│       └── index.ts          # Jest mocks for testing
├── package.json               # Library dependencies
├── tsconfig.json             # TypeScript configuration
├── jest.config.js            # Jest test configuration
└── README.md                 # This file
```

### Core Components

- **🔄 KafkaService**: Kafka client wrapper and utilities
- **📦 MessagingModule**: NestJS module for dependency injection
- **🧪 Mocks**: Testing utilities and mock implementations
- **🔗 Exports**: Centralized library exports

---

## 🔧 API Reference

### KafkaService

Core service providing Kafka client functionality with connection management and error handling.

```typescript
import { KafkaService } from "@integral-x/messaging";

@Injectable()
export class ProductService {
  constructor(private readonly kafkaService: KafkaService) {}

  // Create producer
  async publishEvent(topic: string, data: any) {
    const producer = this.kafkaService.createProducer();
    await producer.connect();

    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(data),
          key: data.id, // Optional partitioning key
        },
      ],
    });

    await producer.disconnect();
  }

  // Create consumer
  async startConsumer(groupId: string, topics: string[]) {
    const consumer = this.kafkaService.createConsumer(groupId);
    await consumer.connect();

    for (const topic of topics) {
      await consumer.subscribe({ topic, fromBeginning: false });
    }

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = JSON.parse(message.value?.toString() || "{}");
        await this.handleMessage(topic, data);
      },
    });
  }
}
```

**Methods:**

- `createProducer()`: Creates a new Kafka producer instance
- `createConsumer(groupId)`: Creates a new Kafka consumer with group ID

### MessagingModule

NestJS module providing messaging services and configuration.

```typescript
import { MessagingModule } from "@integral-x/messaging";

@Module({
  imports: [
    MessagingModule,
    // other modules...
  ],
  providers: [YourService],
})
export class YourModule {}
```

**Features:**

- **Environment Configuration**: Automatic Kafka broker configuration
- **Validation**: Environment variable validation with Joi
- **Global Module**: Available across all modules when imported
- **Testing Support**: Mock implementations for testing

---

## 🔄 Event Patterns

### Producer Pattern

```typescript
@Injectable()
export class EventProducer {
  constructor(private readonly kafkaService: KafkaService) {}

  async publishProductEvent(productId: string, action: string) {
    const producer = this.kafkaService.createProducer();

    try {
      await producer.connect();
      await producer.send({
        topic: "product-events",
        messages: [
          {
            key: productId,
            value: JSON.stringify({
              productId,
              action,
              timestamp: new Date().toISOString(),
            }),
          },
        ],
      });
    } finally {
      await producer.disconnect();
    }
  }
}
```

### Consumer Pattern

```typescript
@Injectable()
export class EventConsumer implements OnModuleInit {
  constructor(private readonly kafkaService: KafkaService) {}

  async onModuleInit() {
    await this.startConsumer();
  }

  private async startConsumer() {
    const consumer = this.kafkaService.createConsumer("product-consumer-group");

    await consumer.connect();
    await consumer.subscribe({
      topic: "product-events",
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const event = JSON.parse(message.value?.toString() || "{}");
          await this.handleProductEvent(event);
        } catch (error) {
          console.error("Error processing message:", error);
          // Implement dead letter queue or retry logic
        }
      },
    });
  }

  private async handleProductEvent(event: any) {
    // Process the event
    console.log("Processing product event:", event);
  }
}
```

---

## 🧪 Testing

### Running Tests

```bash
# Run messaging library tests
npx nx test @integral-x/messaging

# Run with coverage
npx nx test @integral-x/messaging --coverage

# Lint the library
npx nx lint @integral-x/messaging
```

### Mock Usage

The library provides comprehensive mocks for testing:

```typescript
// In your test files
import { KafkaService } from "@integral-x/messaging";

// Mock is automatically applied in test environment
describe("ProductService", () => {
  let service: ProductService;
  let kafkaService: KafkaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [MessagingModule],
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    kafkaService = module.get<KafkaService>(KafkaService);
  });

  it("should send message successfully", async () => {
    const mockProducer = {
      connect: jest.fn(),
      send: jest.fn(),
      disconnect: jest.fn(),
    };

    jest.spyOn(kafkaService, "createProducer").mockReturnValue(mockProducer);

    await service.publishEvent("test-topic", { id: "123" });

    expect(mockProducer.connect).toHaveBeenCalled();
    expect(mockProducer.send).toHaveBeenCalledWith({
      topic: "test-topic",
      messages: [{ value: JSON.stringify({ id: "123" }) }],
    });
    expect(mockProducer.disconnect).toHaveBeenCalled();
  });
});
```

### Integration Testing

```typescript
// For integration tests with real Kafka
describe("Kafka Integration", () => {
  let kafkaService: KafkaService;

  beforeAll(async () => {
    // Set up test Kafka environment
    process.env.KAFKA_BROKERS = "localhost:9092";
    process.env.KAFKA_CLIENT_ID = "test-client";
  });

  it("should produce and consume messages", async () => {
    const producer = kafkaService.createProducer();
    const consumer = kafkaService.createConsumer("test-group");

    // Test implementation
  });
});
```

---

## ⚙️ Configuration

### Environment Variables

```bash
KAFKA_BROKERS=kafka:9092              # Comma-separated broker list
KAFKA_CLIENT_ID=your-service-name     # Unique client identifier
```

### Advanced Configuration

```typescript
// Custom Kafka configuration
const kafkaConfig = {
  clientId: "custom-client",
  brokers: ["broker1:9092", "broker2:9092"],
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: "username",
    password: "password",
  },
};
```

---

## 🚀 Usage Examples

### Health Check Producer

```typescript
// apps/api-gateway/src/messaging/health.producer.ts
import { KafkaService } from "@integral-x/messaging";

@Injectable()
export class HealthProducer {
  constructor(private readonly kafkaService: KafkaService) {}

  async sendHealthCheck(status: string) {
    const producer = this.kafkaService.createProducer();
    await producer.connect();

    await producer.send({
      topic: "health-checks",
      messages: [
        {
          value: JSON.stringify({
            status,
            timestamp: new Date().toISOString(),
            service: "api-gateway",
          }),
        },
      ],
    });

    await producer.disconnect();
  }
}
```

### Product Event Consumer

```typescript
// apps/ebay-service/src/kafka/consumers/product.consumer.ts
import { KafkaService } from "@integral-x/messaging";

@Injectable()
export class ProductConsumer {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly productService: ProductService,
  ) {}

  async handleProductGet(message: KafkaMessage) {
    const { productId } = JSON.parse(message.value?.toString() || "{}");
    await this.productService.getProductById(productId);
  }
}
```

---

## 🔗 Integration

### With API Gateway

```typescript
// apps/api-gateway/src/app.module.ts
import { MessagingModule } from "@integral-x/messaging";

@Module({
  imports: [
    MessagingModule,
    HealthModule,
    // other modules...
  ],
})
export class AppModule {}
```

### With Microservices

```typescript
// apps/ebay-service/src/app.module.ts
import { MessagingModule } from "@integral-x/messaging";

@Module({
  imports: [
    MessagingModule,
    ProductModule,
    // other modules...
  ],
})
export class AppModule {}
```

---

## 🛡️ Best Practices

### Error Handling

```typescript
async publishWithRetry(topic: string, message: any, retries = 3) {
  const producer = this.kafkaService.createProducer();

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await producer.connect();
      await producer.send({ topic, messages: [{ value: JSON.stringify(message) }] });
      return; // Success
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    } finally {
      await producer.disconnect();
    }
  }
}
```

### Connection Management

```typescript
// Reuse connections for better performance
@Injectable()
export class OptimizedProducer implements OnModuleInit, OnModuleDestroy {
  private producer: Producer;

  async onModuleInit() {
    this.producer = this.kafkaService.createProducer();
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async send(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}
```

### Message Serialization

```typescript
// Consistent message format
interface EventMessage<T = any> {
  id: string;
  type: string;
  timestamp: string;
  data: T;
  source: string;
}

async publishEvent<T>(topic: string, type: string, data: T) {
  const message: EventMessage<T> = {
    id: uuidv4(),
    type,
    timestamp: new Date().toISOString(),
    data,
    source: 'ebay-service'
  };

  await this.send(topic, message);
}
```

---

## 📚 Related Libraries

- **[Common Library](../common/README.md)**: Shared types and utilities
- **[Observability Library](../observability/README.md)**: Logging and monitoring
- **[Auth Library](../auth/README.md)**: Authentication and authorization

---

## 🔧 Development

### Building the Library

```bash
# Build the messaging library
npx nx build @integral-x/messaging

# Lint the library
npx nx lint @integral-x/messaging
```

### Contributing

1. **Error Handling**: Implement proper error handling and retries
2. **Testing**: Add comprehensive tests for new features
3. **Documentation**: Update README for new functionality
4. **Performance**: Consider connection pooling and batching

---

## 📄 License

Copyright (c) 2025 Integral-X. All rights reserved.
