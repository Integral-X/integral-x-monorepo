# Observability Library

This library provides logging, metrics, and tracing utilities for use across services in the Integral-X monorepo.

## Structure

```
libs/observability/
  src/
    logger.ts         # Winston-based logging
    metrics.ts        # Prometheus metrics
    tracing.ts        # OpenTelemetry tracing
    index.ts          # Entry point
  package.json
  tsconfig.json
```

## Usage
- Import logging, metrics, or tracing utilities from `@integral-x/observability` in your services.
- Enables consistent observability and monitoring across the platform. 