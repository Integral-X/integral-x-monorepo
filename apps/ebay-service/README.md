# eBay Service

This is the eBay microservice for the Integral-X Marketplace Integration Monorepo.

## Features
- REST APIs for product and health endpoints
- Kafka consumer/producer for async event-driven communication
- Postgres (schema-per-microservice)
- Redis caching
- Prometheus metrics and OpenTelemetry tracing

## Structure

```
apps/ebay-service/
  src/
    controllers/      # REST endpoints
    kafka/
      consumers/      # Kafka consumers
      producers/      # Kafka producers
    services/         # Business logic
    repositories/     # DB access
    external/         # eBay API clients
    cache/            # Redis cache
    dto/              # Request/response DTOs
    config/           # App/Kafka/Redis/Postgres config
    entities/         # TypeORM entities
    types/            # Shared types
    mappers/          # Data mappers
    modules/          # NestJS modules
  __tests__/          # Unit/integration tests (not e2e)
  Dockerfile          # Containerization
  ...
```

## End-to-End (e2e) Tests
- e2e tests are now located in a dedicated package: `apps/ebay-service-e2e/`
- See that package for e2e test setup and instructions.

## Running Locally
- See the root README for setup, environment, and Docker instructions. 