# Integral-X Marketplace Integration Monorepo

Enterprise-grade, scalable microservices architecture for integrating major marketplaces using Node.js, TypeScript, GraphQL, REST, Kafka, Postgres, Docker, and Kubernetes.

---

## Architecture Diagram

> **Note:** For a universally viewable diagram, see the SVG below. The ASCII diagram is also provided for text-based environments.

### Architecture Diagram (SVG)

![Architecture Diagram](Architecture.svg)

### ASCII Diagram

```
                    +-------------------+
                    |   Frontend App    |
                    |   (React, etc.)   |
                    +---------+---------+
                              |
                              |  (GraphQL Request)
                              v
                    +-------------------+
                    |   API Gateway     |
                    | (NestJS, GraphQL) |
                    +---------+---------+
                              |
             +----------------+----------------+
             |                |                |
             v                v                v
   +----------------+ +----------------+ +----------------+
   | eBay Service   | | Amazon Service*| |   ...          |
   | (NestJS, REST) | | (NestJS, REST) | | (Future svc)   |
   +-------+--------+ +-------+--------+ +-------+--------+
           |                  |                  |
           v                  v                  v
   +----------------+ +----------------+ +----------------+
   | Postgres DB    | | Postgres DB    | | Postgres DB    |
   | (Schema: ebay) | | (Schema: amzn)|  | (Schema: ...)  |
   +----------------+ +----------------+ +----------------+

Other infrastructure:
- Kafka (for async/event-driven communication)
- Redis (for caching, rate limiting)
- Zookeeper (for Kafka coordination)
- Prometheus, OpenTelemetry, Jaeger (observability)

Legend:
- External frontend apps communicate with the API Gateway exclusively via GraphQL.
- API Gateway federates and routes requests to microservices (current: eBay; future: Amazon, etc.).
- Each microservice uses schema-based separation in Postgres for data isolation.
- All services and the gateway are containerized and orchestrated via Kubernetes.
- Kafka enables async/event-driven communication.
- Prometheus, OpenTelemetry, and Jaeger provide observability.
- Architecture is easily extensible: add a new microservice, register it with the gateway, and connect it to Kafka/Postgres as needed.
* Amazon Service is shown as an example of future extensibility.
```

---

## Local Development & Running Locally

### Prerequisites
- Node.js 20+
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
- Copy the example `.env` files for each service to `.env`. See the [Example .env Files](#example-env-files) section below.
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
- eBay microservice at `http://localhost:4100`

### 5. Run Tests
```bash
npx nx run-many --target=test --all
```
- This runs all tests for all apps and libraries in the monorepo.

### 6. Lint and Format
```bash
npx nx run-many --target=lint --all
npx nx format:write
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
  api-gateway/         # GraphQL Gateway (NestJS, Apollo Federation, JWT, Kafka, Prometheus, tracing)
  ebay-service/        # eBay microservice (NestJS, REST, TypeORM, Kafka, Prometheus, tracing)
  ebay-service-e2e/    # e2e test project for eBay service (not a deployable service)
libs/
  common/              # Shared types, error handling, and utils
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
- **eBay Microservice:** REST APIs, health endpoints, Prometheus metrics (`/health/metrics`), Kafka consumer, Postgres (schema-per-microservice), enterprise folder structure.
- **Messaging:** Kafka for async/event-driven communication, shared messaging library.
- **Database:** Postgres, TypeORM, schema-per-microservice.
- **Observability:** Winston logging, Prometheus metrics, OpenTelemetry tracing, correlation IDs.
- **Security:** JWT auth, rate limiting, centralized error handling, secrets via env/K8s.
- **DevOps:** Docker Compose, Kubernetes, GitHub Actions CI/CD.
- **Testing:** Jest, Supertest, e2e tests for health endpoints.

---

## License

Copyright (c) Integral-X. All rights reserved.
