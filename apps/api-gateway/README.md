# API Gateway

GraphQL API Gateway for the Integral-X Marketplace Integration platform. Serves as the unified entry point for all client applications, providing schema federation and request routing to downstream microservices.

[![Service Status](https://img.shields.io/badge/status-active-brightgreen)](http://localhost:4000/health)
[![Port](https://img.shields.io/badge/port-4000-blue)](http://localhost:4000)
[![GraphQL](https://img.shields.io/badge/GraphQL-ready-purple)](http://localhost:4000/graphql)

---

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies (from monorepo root)
yarn install

# Start in development mode
npx nx serve api-gateway

# Or start with Docker
docker-compose up api-gateway
```

### Endpoints

- **Health Check**: `GET /health`
- **GraphQL Playground**: `GET /graphql`
- **Metrics**: `GET /metrics`

---

## 🏗️ Architecture

### Core Features

- **🔗 GraphQL Federation**: Unified schema across microservices
- **🔐 JWT Authentication**: Secure API access
- **⚡ Rate Limiting**: Request throttling and protection
- **📊 Observability**: Metrics, logging, and tracing
- **🚀 Event Publishing**: Kafka message production

### Request Flow

```
Client → API Gateway → GraphQL Resolvers → Kafka Events → Microservices
```

### Key Components

```
src/
├── graphql/
│   ├── schema.gql              # Auto-generated GraphQL schema
│   ├── root.resolver.ts        # Root query resolver
│   └── marketplace.resolver.ts # Marketplace-specific resolvers
├── messaging/
│   └── health.producer.ts      # Kafka health check producer
├── config/
│   ├── validation.ts           # Environment validation
│   └── default.ts             # Default configuration
├── auth.module.ts              # Authentication module
├── health.controller.ts        # Health check endpoint
├── rate-limit.ts              # Rate limiting configuration
└── main.ts                    # Application bootstrap
```

---

## 🔧 Configuration

### Environment Variables

```bash
NODE_ENV=development
PORT=4000
JWT_SECRET=your-strong-secret-here
OTEL_SERVICE_NAME=api-gateway
JAEGER_HOST=localhost
JAEGER_PORT=6832
KAFKA_BROKERS=kafka:9092
KAFKA_CLIENT_ID=api-gateway
```

### GraphQL Schema Federation

To add a new federated service:

1. **Implement Federation**: Use `@nestjs/graphql` with federation support
2. **Register Service**: Add service to gateway's schema configuration
3. **Update Resolvers**: Create resolvers for new service endpoints
4. **Test Integration**: Verify schema stitching works correctly

### Rate Limiting

- **Global Limits**: Configured in `src/rate-limit.ts`
- **Per-IP Limits**: 100 requests per 15 minutes (default)
- **Redis Integration**: Available for distributed rate limiting

---

## 🧪 Testing

```bash
# Unit tests
npx nx test api-gateway

# Linting
npx nx lint api-gateway

# Build verification
npx nx build api-gateway
```

### GraphQL Testing

```bash
# Test health query
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ health }"}'

# Test marketplace status
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ marketplaceStatus }"}'
```

---

## 📊 Monitoring

### Health Checks

- **Endpoint**: `GET /health`
- **Response**: `{"status": "ok"}`
- **Kafka Integration**: Publishes health events

### Metrics

- **Endpoint**: `GET /metrics`
- **Format**: Prometheus format
- **Includes**: Request counts, response times, error rates

### Tracing

- **Provider**: Jaeger/OpenTelemetry
- **Correlation IDs**: Automatic request correlation
- **Distributed Tracing**: End-to-end request tracking

---

## 🔐 Security

### Authentication

- **Method**: JWT tokens
- **Guard**: `JwtAuthGuard` from `@integral-x/auth`
- **Headers**: `Authorization: Bearer <token>`

### Error Handling

- **Filter**: Global `AllExceptionsFilter`
- **Logging**: Structured error logging
- **Responses**: Consistent error format

### CORS & Security Headers

- **CORS**: Enabled for development
- **Rate Limiting**: Express-rate-limit integration
- **Security Headers**: Helmet.js integration (production)

---

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -f Dockerfile.api-gateway -t api-gateway .

# Run container
docker run -p 4000:4000 api-gateway
```

### Kubernetes

See `k8s/api-gateway-*.yaml` for deployment manifests.

---

## 🔗 Related Services

- **[eBay Service](../ebay-service/README.md)**: Product data microservice
- **[Messaging Library](../../libs/messaging/README.md)**: Kafka utilities
- **[Auth Library](../../libs/auth/README.md)**: Authentication utilities
- **[Observability Library](../../libs/observability/README.md)**: Monitoring tools

---

## 📚 Additional Resources

- **[GraphQL Playground](http://localhost:4000/graphql)**: Interactive query interface
- **[Health Endpoint](http://localhost:4000/health)**: Service health status
- **[Metrics Endpoint](http://localhost:4000/metrics)**: Prometheus metrics
