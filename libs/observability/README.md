# Observability Library

Comprehensive observability utilities for the Integral-X monorepo, providing structured logging, Prometheus metrics, OpenTelemetry tracing, and monitoring tools for production-ready applications.

[![Library](https://img.shields.io/badge/type-library-blue)](https://github.com/integral-x/integral-x-monorepo)
[![Prometheus](https://img.shields.io/badge/metrics-Prometheus-orange)](https://prometheus.io/)
[![OpenTelemetry](https://img.shields.io/badge/tracing-OpenTelemetry-blue)](https://opentelemetry.io/)
[![Winston](https://img.shields.io/badge/logging-Winston-green)](https://github.com/winstonjs/winston)

---

## 🚀 Quick Start

### Installation

```bash
# Library is automatically available in the monorepo
import { logger, getMetrics, initTracing } from '@integral-x/observability';
```

### Basic Usage

```typescript
// Logging
import { logger, logInfo, logError } from "@integral-x/observability";

logger.info("Application started", { port: 4000 });
logError("Database connection failed", { error: err.message });

// Metrics
import { requestCounter, getMetrics } from "@integral-x/observability";

requestCounter.inc({ method: "GET", route: "/health", status: "200" });
const metrics = await getMetrics(); // Prometheus format

// Tracing
import { initTracing } from "@integral-x/observability";

initTracing("api-gateway", "localhost", 6832);
```

---

## 🏗️ Library Structure

### Directory Layout

```
libs/observability/
├── src/
│   ├── logger.ts              # Winston-based structured logging
│   ├── metrics.ts             # Prometheus metrics collection
│   ├── tracing.ts             # OpenTelemetry distributed tracing
│   ├── index.ts              # Library exports
│   └── types.ts              # TypeScript interfaces (if needed)
├── package.json               # Library dependencies
├── tsconfig.json             # TypeScript configuration
├── jest.config.js            # Jest test configuration
└── README.md                 # This file
```

### Core Components

- **📝 Logger**: Structured JSON logging with Winston
- **📊 Metrics**: Prometheus metrics collection and export
- **🔍 Tracing**: OpenTelemetry distributed tracing
- **🔗 Exports**: Centralized observability utilities

---

## 🔧 API Reference

### Logger

Winston-based structured logging with JSON format and multiple transports.

```typescript
import { logger, logInfo, logError } from "@integral-x/observability";

// Direct logger usage
logger.info("User logged in", {
  userId: "123",
  email: "user@example.com",
  correlationId: "req-uuid-123",
});

logger.error("Database error", {
  error: error.message,
  stack: error.stack,
  query: "SELECT * FROM users",
});

// Convenience functions
logInfo("Operation completed successfully", { duration: 150 });
logError("Validation failed", { field: "email", value: "invalid" });
```

**Features:**

- **Structured Logging**: JSON format for easy parsing
- **Log Levels**: Error, warn, info, debug, verbose
- **Metadata Support**: Rich context information
- **Correlation IDs**: Request tracking across services
- **Multiple Transports**: Console, file, external services

**Log Format:**

```json
{
  "level": "info",
  "message": "User logged in",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "service": "integral-x",
  "userId": "123",
  "correlationId": "req-uuid-123"
}
```

### Metrics

Prometheus-compatible metrics collection with automatic default metrics.

```typescript
import { requestCounter, getMetrics } from "@integral-x/observability";

// Increment request counter
requestCounter.inc({
  method: "GET",
  route: "/products/:id",
  status: "200",
});

// Custom metrics
import client from "prom-client";

const customGauge = new client.Gauge({
  name: "active_connections",
  help: "Number of active connections",
  labelNames: ["service"],
});

customGauge.set({ service: "api-gateway" }, 42);

// Export metrics (for /metrics endpoint)
const metricsString = await getMetrics();
```

**Built-in Metrics:**

- **HTTP Requests**: Request count by method, route, status
- **System Metrics**: CPU, memory, event loop lag
- **Process Metrics**: Uptime, heap usage, GC stats
- **Custom Metrics**: Application-specific measurements

### Tracing

OpenTelemetry distributed tracing with Jaeger integration.

```typescript
import { initTracing } from "@integral-x/observability";

// Initialize tracing (call once at application startup)
initTracing(
  "api-gateway", // Service name
  "localhost", // Jaeger host
  6832, // Jaeger port
);

// Tracing is automatic for HTTP requests, database calls, etc.
// Manual span creation (if needed)
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("my-service");
const span = tracer.startSpan("custom-operation");

try {
  // Your operation here
  span.setAttributes({
    "operation.type": "data-processing",
    "user.id": "123",
  });
} finally {
  span.end();
}
```

**Features:**

- **Automatic Instrumentation**: HTTP, database, messaging
- **Distributed Context**: Request correlation across services
- **Custom Spans**: Manual instrumentation for business logic
- **Jaeger Integration**: Visual trace analysis
- **Performance Monitoring**: Request latency and bottlenecks

---

## 📊 Monitoring Integration

### Health Endpoints

```typescript
// In your NestJS controller
import { getMetrics } from "@integral-x/observability";

@Controller("health")
export class HealthController {
  @Get("metrics")
  async getMetrics(@Res() res: Response) {
    res.set("Content-Type", "text/plain");
    res.send(await getMetrics());
  }
}
```

### Request Middleware

```typescript
// Express middleware for request logging and metrics
import { logger, requestCounter } from "@integral-x/observability";

export function observabilityMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = Date.now();
  const correlationId = req.headers["x-correlation-id"] || uuidv4();

  // Add correlation ID to request
  (req as any).correlationId = correlationId;
  res.setHeader("x-correlation-id", correlationId);

  // Log request
  logger.info("Request started", {
    method: req.method,
    url: req.url,
    correlationId,
  });

  res.on("finish", () => {
    const duration = Date.now() - start;

    // Log response
    logger.info("Request completed", {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      correlationId,
    });

    // Update metrics
    requestCounter.inc({
      method: req.method,
      route: req.route?.path || req.url,
      status: res.statusCode.toString(),
    });
  });

  next();
}
```

---

## 🧪 Testing

### Running Tests

```bash
# Run observability library tests
npx nx test @integral-x/observability

# Run with coverage
npx nx test @integral-x/observability --coverage

# Lint the library
npx nx lint @integral-x/observability
```

### Testing Logging

```typescript
describe("Logger", () => {
  it("should log structured messages", () => {
    const consoleSpy = jest.spyOn(console, "log");

    logger.info("Test message", { userId: "123" });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('"message":"Test message"'),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('"userId":"123"'),
    );
  });
});
```

### Testing Metrics

```typescript
describe("Metrics", () => {
  it("should increment request counter", async () => {
    requestCounter.inc({ method: "GET", route: "/test", status: "200" });

    const metrics = await getMetrics();
    expect(metrics).toContain("http_requests_total");
    expect(metrics).toContain('method="GET"');
  });
});
```

---

## 🚀 Usage Examples

### API Gateway Integration

```typescript
// apps/api-gateway/src/main.ts
import { logger, initTracing } from "@integral-x/observability";

async function bootstrap() {
  // Initialize tracing
  initTracing("api-gateway", "localhost", 6832);

  const app = await NestFactory.create(AppModule);

  // Add observability middleware
  app.use(observabilityMiddleware);

  const port = 4000;
  await app.listen(port);

  logger.info("API Gateway started", { port });
}
```

### Microservice Integration

```typescript
// apps/ebay-service/src/services/product.service.ts
import { logger, requestCounter } from "@integral-x/observability";

@Injectable()
export class ProductService {
  async getProductById(id: string): Promise<Product | null> {
    const startTime = Date.now();

    logger.info("Fetching product", { productId: id });

    try {
      // Check cache first
      let product = await this.cacheService.getProduct(id);
      if (product) {
        logger.info("Product found in cache", {
          productId: id,
          source: "cache",
          duration: Date.now() - startTime,
        });
        return product;
      }

      // Check database
      const entity = await this.repository.findById(id);
      if (entity) {
        product = { ...entity, source: "database" };
        await this.cacheService.setProduct(product);

        logger.info("Product found in database", {
          productId: id,
          source: "database",
          duration: Date.now() - startTime,
        });
        return product;
      }

      // Fetch from external API
      product = await this.ebayApi.getProductById(id);
      if (product) {
        await this.repository.save(product);
        await this.cacheService.setProduct(product);

        logger.info("Product fetched from external API", {
          productId: id,
          source: "external",
          duration: Date.now() - startTime,
        });
        return product;
      }

      logger.warn("Product not found", { productId: id });
      return null;
    } catch (error) {
      logger.error("Error fetching product", {
        productId: id,
        error: error.message,
        duration: Date.now() - startTime,
      });
      throw error;
    }
  }
}
```

### Error Handling Integration

```typescript
// With common library exception filter
import { logger } from "@integral-x/observability";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    logger.error("Request error", {
      url: request.url,
      method: request.method,
      status: 500,
      error: exception,
      correlationId: request.correlationId,
    });

    // Return error response...
  }
}
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# Tracing configuration
OTEL_SERVICE_NAME=api-gateway
JAEGER_HOST=localhost
JAEGER_PORT=6832

# Logging configuration
LOG_LEVEL=info
LOG_FORMAT=json
```

### Advanced Configuration

```typescript
// Custom logger configuration
import winston from "winston";

const customLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: {
    service: process.env.SERVICE_NAME || "unknown",
    version: process.env.SERVICE_VERSION || "1.0.0",
  },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
```

---

## 🔗 Integration

### With API Gateway

```typescript
// apps/api-gateway/src/app.module.ts
import { logger } from "@integral-x/observability";

@Module({
  // module configuration
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(observabilityMiddleware).forRoutes("*");
  }
}
```

### With Microservices

```typescript
// apps/ebay-service/src/app.module.ts
import { initTracing } from "@integral-x/observability";

// Initialize in main.ts
initTracing("ebay-service", "localhost", 6832);
```

### With Docker

```dockerfile
# Dockerfile
ENV OTEL_SERVICE_NAME=api-gateway
ENV JAEGER_HOST=jaeger
ENV JAEGER_PORT=6832

EXPOSE 4000
CMD ["node", "dist/main.js"]
```

---

## 📈 Production Monitoring

### Prometheus Integration

```yaml
# prometheus.yml
scrape_configs:
  - job_name: "api-gateway"
    static_configs:
      - targets: ["api-gateway:4000"]
    metrics_path: "/health/metrics"

  - job_name: "ebay-service"
    static_configs:
      - targets: ["ebay-service:4100"]
    metrics_path: "/health/metrics"
```

### Grafana Dashboards

Key metrics to monitor:

- **Request Rate**: Requests per second by service
- **Error Rate**: Error percentage by endpoint
- **Response Time**: P50, P95, P99 latencies
- **System Resources**: CPU, memory, disk usage
- **Business Metrics**: Products fetched, cache hit rate

### Alerting Rules

```yaml
# alerting.yml
groups:
  - name: integral-x-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High response time detected"
```

---

## 📚 Related Libraries

- **[Common Library](../common/README.md)**: Shared types and error handling
- **[Auth Library](../auth/README.md)**: Authentication and authorization
- **[Messaging Library](../messaging/README.md)**: Event-driven communication

---

## 🔧 Development

### Building the Library

```bash
# Build the observability library
npx nx build @integral-x/observability

# Lint the library
npx nx lint @integral-x/observability
```

### Contributing

1. **Structured Logging**: Ensure all logs include relevant context
2. **Metric Naming**: Follow Prometheus naming conventions
3. **Performance**: Consider the overhead of observability code
4. **Testing**: Add tests for new observability features

---

## 📄 License

Copyright (c) 2025 Integral-X. All rights reserved.
