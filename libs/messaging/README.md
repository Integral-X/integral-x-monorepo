# Messaging Library

This library provides KafkaJS-based messaging utilities for use across services in the Integral-X monorepo.

## Structure

```
libs/messaging/
  src/
    kafka.service.ts         # KafkaJS wrapper/service
    messaging.module.ts      # NestJS module for messaging
    messaging.module.mock.ts # Mock module for testing
    index.ts                 # Entry point
    __mocks__/               # Jest mocks for testing
  package.json
  tsconfig.json
```

## Usage
- Import messaging utilities or modules from `@integral-x/messaging` in your services.
- Enables consistent, testable event-driven communication across the platform. 