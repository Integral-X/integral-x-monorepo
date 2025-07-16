# Integral-X Marketplace Integration Monorepo

Enterprise-grade, scalable microservices architecture for integrating major marketplaces (eBay, Amazon, Walmart, etc.) using Node.js, TypeScript, GraphQL, REST, Kafka, Postgres, Docker, and Kubernetes.

---

## Architecture Diagram

> **Note:** For a universally viewable diagram, see the SVG below. The ASCII diagram is also provided for text-based environments.

### Architecture Diagram (SVG)

![Architecture Diagram](Architecture.svg)

### ASCII Diagram

```
                                 +-------------------+
                                 |   API Gateway     |
                                 | (NestJS, GraphQL) |
                                 +---------+---------+
                                           |
+--------v--------+
|   eBay Service  |
| (NestJS, REST)  |
+--------+--------+
         |
+--------v--------+
|  Postgres DB    |
| (Schema: eBay)  |
+-----------------+

         <------------------------ Kafka (Broker) ------------------------>
         <------------------------ Zookeeper ----------------------------->
         <------------------------ Redis (Caching, Rate Limiting) -------->

Cross-Cutting Concerns (applies to all services):
--------------------------------------------------------------------------------
| - JWT Auth & Passport.js (Security)                                          |
| - Rate Limiting (API Gateway, Redis-backed for distributed)                  |
| - Centralized Error Handling (AllExceptionsFilter)                           |
| - Logging (Winston)                                                          |
| - Metrics (Prometheus, /metrics endpoints)                                   |
| - Distributed Tracing (OpenTelemetry, Jaeger/Zipkin)                         |
| - Correlation IDs (for traceability)                                         |
| - Secrets Management (.env, K8s Secrets)                                     |
| - CI/CD (GitHub Actions)                                                     |
| - Containerization (Docker, Docker Compose)                                  |
| - Orchestration (Kubernetes)                                                 |
--------------------------------------------------------------------------------

Legend:
- All services and the gateway are containerized and orchestrated via Kubernetes.
- CI/CD automates build, test, and deployment.
- Observability (logging, metrics, tracing) is implemented in all services.
- Redis is used for caching and distributed rate limiting.
- Kafka enables async/event-driven communication.
- Each microservice has its own Postgres schema for data isolation.
```

---

## Local Development & Running Locally

### Prerequisites
- Node.js 18+
- Yarn (preferred; npm is not officially supported/tested)
- Docker & Docker Compose

### 1. Clone the Repository
```bash
git clone https://github.com/integral-x/integral-x-monorepo.git
cd integral-x-monorepo
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Set Up Environment Variables
- Copy the example `.env` files for each service to `.env`:
  - `cp apps/api-gateway/.env.example apps/api-gateway/.env`
  - `cp apps/ebay-service/.env.example apps/ebay-service/.env`
  - `cp apps/amazon-service/.env.example apps/amazon-service/.env`
  - `cp apps/walmart-service/.env.example apps/walmart-service/.env`
  - (Optional) `cp apps/frontend/.env.example apps/frontend/.env`
- Edit values as needed for your local setup.

#### Example .env Files

**API Gateway (`apps/api-gateway/.env`)**
```
NODE_ENV=development
PORT=4000
# WARNING: Do not use this default secret in production.
# Generate a strong, unique secret for each environment.
JWT_SECRET=<your-strong-secret>
OTEL_SERVICE_NAME=api-gateway
JAEGER_HOST=localhost
JAEGER_PORT=6832
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=api-gateway
```

**eBay Service (`apps/ebay-service/.env`)**
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=postgres
DB_SCHEMA=ebay
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=ebay-service
```

### 4. Start All Services Locally
```bash
cd docker
# Build and start all services, Kafka, and Postgres
docker-compose up --build
```
- The API Gateway will be available at `http://localhost:4000`
- Microservices at `http://localhost:4100`

### 5. Run Tests
```bash
yarn test
```
- This runs all tests for all apps and libraries in the monorepo.

### 6. Lint and Format
```bash
yarn lint
yarn format
```

### 7. Stopping Services
```bash
# In the docker directory
docker-compose down
```

---

## Tech Stack & Rationale

| Component         | Technology/Tooling                | Why This Choice |
|-------------------|-----------------------------------|-----------------|
| Language & Runtime| Node.js, TypeScript               | Performance, scalability, and a strong ecosystem; TypeScript adds type safety and maintainability. |
| API Gateway       | NestJS, Apollo Federation, GraphQL | Modular, scalable framework; GraphQL enables unified, flexible data access and federation. |
| Microservices     | NestJS, REST, TypeORM, TypeScript  | Enterprise patterns, REST for simplicity and interoperability, TypeORM for DB abstraction. |
| Messaging         | Kafka, kafkajs                     | High-throughput, reliable async messaging; decouples services and supports event-driven design. |
| Database          | Postgres (schema-per-service)       | Proven, open-source RDBMS; schema-per-service for isolation and scalability. |
| Auth              | JWT, Passport.js                   | Secure, stateless authentication; Passport.js offers extensible strategies. |
| Observability     | Winston, Prometheus, OpenTelemetry | Comprehensive logging, metrics, and distributed tracing for monitoring and troubleshooting. |
| Tracing           | Jaeger/Zipkin                      | Distributed tracing for visibility into request flows and performance bottlenecks. |
| Containerization  | Docker, Docker Compose             | Consistent, reproducible local development and deployment environments. |
| Orchestration     | Kubernetes                         | Automated deployment, scaling, and management of containers in production. |
| CI/CD             | GitHub Actions                     | Automated linting, testing, building, and deployment for the monorepo. |
| Testing           | Jest, Supertest                    | Reliable unit and end-to-end testing for code quality and confidence. |

---

## Project Structure

```
apps/
  api-gateway/         # GraphQL Gateway
  ebay-service/        # eBay microservice (REST)
libs/
  common/              # Shared types, error handling, utils
  auth/                # Auth logic (JWT)
  observability/       # Logging, tracing, metrics
  messaging/           # KafkaJS-based messaging utilities
docker/                # Docker Compose, Dockerfiles
k8s/                   # Kubernetes manifests
.github/
  workflows/           # CI/CD workflows
```

---

## Key Features

- **Monorepo (Nx):** Centralized management, atomic commits, shared code.
- **API Gateway:** GraphQL, Apollo Federation, JWT auth, rate limiting, error handling, Prometheus metrics (`/metrics`), distributed tracing, Kafka producer.
- **Microservices:** REST APIs, health endpoints, Prometheus metrics (`/health/metrics`), Kafka consumer, Postgres (schema-per-microservice), e2e tests, enterprise folder structure.
- **Messaging:** Kafka for async/event-driven communication, shared messaging library.
- **Database:** Postgres, TypeORM, schema-per-microservice.
- **Observability:** Winston logging, Prometheus metrics, OpenTelemetry tracing, correlation IDs.
- **Security:** JWT auth, rate limiting, centralized error handling, secrets via env/K8s.
- **DevOps:** Docker Compose, Kubernetes, GitHub Actions CI/CD.
- **Testing:** Jest, Supertest, e2e tests for health endpoints.

---

## License

Copyright (c) Integral-X. All rights reserved.
