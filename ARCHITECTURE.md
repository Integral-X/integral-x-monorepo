### **System Summary: Microservice Architecture with API Gateway + Kafka + Redis + Postgres**

**Frontend:**

- React-based app sends GraphQL requests to the API Gateway.

**API Gateway:**

- Built with NestJS using GraphQL.
- Exposes federated GraphQL APIs.
- Resolves incoming GraphQL queries by:
  - **Producing Kafka messages** to microservices for async processing.
  - Optionally supporting **synchronous REST/gRPC** for instant responses.
- Optionally caches results in Redis for faster subsequent access.

**eBay Microservice (NestJS-based):**

- Receives Kafka events.
- Attempts to fetch data in this order:
  1. **Redis Cache**
  2. **Postgres (schema: `ebay`)**
  3. **External eBay API**
- On external fetch:
  - Persists data in Postgres.
  - Updates Redis.
- Produces a Kafka event (`ebay.product.persisted`) to notify data was stored.

**Data Storage:**

- Each marketplace service uses its own **Postgres schema** for isolation.
- **Redis** used for read-heavy caching.
- Kafka topics facilitate decoupled event-driven communication.

**Observability & Infra:**

- Uses Prometheus, OpenTelemetry, Jaeger for tracing/metrics.
- Orchestrated via Kubernetes.
- Fully extensible: add new services (e.g., Amazon) with minimal change.

---

### Folder Structure (Monorepo, Nx, DDD-inspired)

```
apps/
  api-gateway/         # GraphQL Gateway (NestJS, Apollo Federation, JWT, Kafka, Prometheus, tracing)
  ebay-service/        # eBay microservice (NestJS, REST, TypeORM, Kafka, Prometheus, tracing)
  ebay-service-e2e/    # Dedicated e2e test project for eBay service (not a deployable service)
libs/
  common/              # Shared types, error handling, and utils
  auth/                # Auth logic (JWT)
  observability/       # Logging, tracing, metrics
  messaging/           # KafkaJS-based messaging utilities
docker/                # Docker Compose, Dockerfiles
k8s/                   # Kubernetes manifests
.github/
  workflows/           # CI/CD workflows
tools/                 # Utility scripts (e.g., license header automation)
```

#### eBay Microservice (Clean DDD-like)

```
src/
├── app/                       # App-wide modules & bootstrap
├── controllers/               # Expose REST endpoints (optional)
├── kafka/
│   ├── consumers/             # Handle incoming Kafka messages
│   └── producers/             # Send Kafka events
├── services/                  # Business logic (use-cases)
├── repositories/              # DB access layer (Postgres)
├── external/                  # eBay API clients
├── cache/                     # Redis read/write
├── dto/                       # Request/response payloads
├── config/                    # App/Kafka/Redis/Postgres config
```

#### e2e Test Package

```
apps/ebay-service-e2e/
  src/ebay-service/
    health.e2e-spec.ts   # End-to-end tests for eBay service
  package.json           # Independent test runner config
  jest.config.js         # Jest config for e2e
  tsconfig.json          # TypeScript config for e2e
```

---

### ✅ Example Flow: `getProductById(id)`

1. **Frontend** calls:

   ```graphql
   query {
     getProductById(id: "123")
   }
   ```

2. **API Gateway** resolver:
   - Produces `ebay.product.get` Kafka event with `productId: 123`.

3. **eBay Service** Kafka consumer:
   - Checks Redis for product.
   - If not found, queries Postgres.
   - If not found again, fetches from external eBay API.
   - Persists to Postgres, updates Redis.
   - Emits `ebay.product.persisted` event.

4. **API Gateway** may poll Redis or listen for persisted event to respond.
