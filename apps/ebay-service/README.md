# eBay Service

eBay marketplace integration microservice for the Integral-X platform. Provides product data retrieval with multi-tier caching, event-driven communication, and external API integration.

[![Service Status](https://img.shields.io/badge/status-active-brightgreen)](http://localhost:4100/health)
[![Port](https://img.shields.io/badge/port-4100-blue)](http://localhost:4100)
[![API](https://img.shields.io/badge/API-REST-green)](http://localhost:4100/products/123)

---

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies (from monorepo root)
yarn install

# Start in development mode
npx nx serve ebay-service

# Or start with Docker
docker-compose up ebay-service
```

### Endpoints

- **Health Check**: `GET /health`
- **Metrics**: `GET /health/metrics`
- **Product by ID**: `GET /products/:id`

---

## 🏗️ Architecture

### Core Features

- **🛍️ Product Retrieval**: Multi-tier caching strategy
- **⚡ High Performance**: Redis → PostgreSQL → External API
- **🔄 Event-Driven**: Kafka consumer/producer integration
- **📊 Observability**: Metrics, logging, and health checks
- **🔒 Data Validation**: Request/response validation with DTOs

### Data Flow

```
Request → Cache Check → Database Check → External API → Cache Update → Response
```

### Caching Strategy

1. **Redis Cache**: First-level cache (TTL: 1 hour)
2. **PostgreSQL**: Persistent storage with `ebay` schema
3. **External eBay API**: Fallback for cache misses

### Key Components

```
src/
├── controllers/
│   ├── health.controller.ts    # Health & metrics endpoints
│   └── product.controller.ts   # Product REST API
├── services/
│   └── product.service.ts      # Business logic layer
├── repositories/
│   └── product.repository.ts   # Data access layer
├── cache/
│   └── product.cache.service.ts # Redis caching
├── external/
│   └── ebay-api.adapter.ts     # eBay API integration
├── kafka/
│   ├── consumers/
│   │   └── product.consumer.ts # Event consumers
│   └── producers/
│       └── product.producer.ts # Event producers
├── entities/
│   └── product.entity.ts       # TypeORM entities
├── dto/
│   ├── request/                # Request DTOs
│   └── response/               # Response DTOs
├── config/
│   ├── validation.ts           # Environment validation
│   └── redis.config.ts         # Redis configuration
└── types/
    └── product.types.ts        # TypeScript interfaces
```

---

## 🔧 Configuration

### Environment Variables

```bash
NODE_ENV=development
PORT=4100
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=postgres
DB_SCHEMA=ebay
KAFKA_BROKERS=kafka:9092
KAFKA_CLIENT_ID=ebay-service
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_CACHE_TTL_SECONDS=3600
EBAY_API_BASE_URL=https://api.ebay.com
EBAY_API_KEY=mock-api-key
```

### Database Schema

The service uses PostgreSQL with a dedicated `ebay` schema:

```sql
-- Products table in ebay schema
CREATE TABLE ebay.products (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    imageUrl VARCHAR
);
```

---

## 🧪 Testing

### Unit & Integration Tests

```bash
# Run all tests
npx nx test ebay-service

# Run with coverage
npx nx test ebay-service --coverage

# Linting
npx nx lint ebay-service

# Build verification
npx nx build ebay-service
```

### End-to-End Tests

E2E tests are maintained in a separate package for better isolation:

```bash
cd apps/ebay-service-e2e
npm install
npm test
```

### API Testing

```bash
# Test health endpoint
curl http://localhost:4100/health

# Test product retrieval
curl http://localhost:4100/products/123

# Test metrics
curl http://localhost:4100/health/metrics
```

---

## 📊 Monitoring

### Health Checks

- **Endpoint**: `GET /health`
- **Response**: `{"status": "ok"}`
- **Dependencies**: Database, Redis, Kafka connectivity

### Metrics

- **Endpoint**: `GET /health/metrics`
- **Format**: Prometheus format
- **Includes**: Request counts, cache hit rates, response times

### Logging

- **Format**: Structured JSON logging
- **Levels**: Error, warn, info, debug
- **Context**: Request correlation IDs

---

## 🔄 Event Integration

### Kafka Topics

- **Consumed**: `ebay.product.get` - Product retrieval requests
- **Produced**: `ebay.product.persisted` - Product data persistence events
- **Health**: `health-checks` - Service health events

### Event Flow

```
API Gateway → ebay.product.get → Product Service → ebay.product.persisted
```

---

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -f Dockerfile.ebay-service -t ebay-service .

# Run container
docker run -p 4100:4100 ebay-service
```

### Kubernetes

See `k8s/ebay-service-*.yaml` for deployment manifests.

---

## 🔗 Related Services

- **[API Gateway](../api-gateway/README.md)**: GraphQL gateway service
- **[E2E Tests](../ebay-service-e2e/README.md)**: End-to-end test suite
- **[Messaging Library](../../libs/messaging/README.md)**: Kafka utilities
- **[Common Library](../../libs/common/README.md)**: Shared utilities

---

## 📚 Additional Resources

- **[Product API](http://localhost:4100/products/123)**: Example product endpoint
- **[Health Status](http://localhost:4100/health)**: Service health check
- **[Metrics](http://localhost:4100/health/metrics)**: Prometheus metrics
