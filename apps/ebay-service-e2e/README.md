# eBay Service E2E Tests

End-to-end test suite for the eBay microservice, providing comprehensive integration testing in an isolated package for better maintainability and CI/CD integration.

[![Test Status](https://img.shields.io/badge/tests-passing-brightgreen)](https://github.com/integral-x/integral-x-monorepo)
[![Coverage](https://img.shields.io/badge/coverage-85%25-green)](https://github.com/integral-x/integral-x-monorepo)
[![Framework](https://img.shields.io/badge/framework-Jest-red)](https://jestjs.io/)

---

## 🚀 Quick Start

### Prerequisites

- eBay service must be running (port 4100)
- All dependencies (PostgreSQL, Redis, Kafka) must be available

### Running Tests

```bash
# Install dependencies
npm install

# Run all e2e tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

---

## 🏗️ Test Structure

### Directory Layout

```
apps/ebay-service-e2e/
├── src/
│   └── ebay-service/
│       ├── health.e2e-spec.ts     # Health endpoint tests
│       ├── product.e2e-spec.ts    # Product API tests
│       └── integration.e2e-spec.ts # Full integration tests
├── jest.config.js                  # Jest configuration
├── package.json                    # Test dependencies
├── tsconfig.json                   # TypeScript config
└── README.md                       # This file
```

### Test Categories

- **Health Tests**: Service health and readiness checks
- **Product Tests**: Product retrieval and caching behavior
- **Integration Tests**: End-to-end workflow validation
- **Performance Tests**: Response time and load testing

---

## 🧪 Test Scenarios

### Health Endpoint Tests

```typescript
describe("Health Endpoint", () => {
  it("should return 200 OK", async () => {
    const response = await request(app.getHttpServer())
      .get("/health")
      .expect(200);

    expect(response.body).toEqual({ status: "ok" });
  });
});
```

### Product API Tests

```typescript
describe("Product API", () => {
  it("should retrieve product from external API", async () => {
    const response = await request(app.getHttpServer())
      .get("/products/123")
      .expect(200);

    expect(response.body.source).toBe("External eBay API");
  });

  it("should serve from cache on second request", async () => {
    // First request
    await request(app.getHttpServer()).get("/products/123");

    // Second request should hit cache
    const response = await request(app.getHttpServer())
      .get("/products/123")
      .expect(200);

    expect(response.body.source).toBe("Redis Cache");
  });
});
```

---

## 🔧 Configuration

### Jest Configuration

```javascript
module.exports = {
  displayName: "ebay-service-e2e",
  preset: "../../jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },
  testMatch: ["<rootDir>/src/**/*.e2e-spec.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
};
```

### Environment Setup

Tests automatically configure a test environment with:

- **Mocked External APIs**: Prevents real API calls during testing
- **Test Database**: Isolated test data
- **Mock Kafka**: Event simulation without real message broker

---

## 📊 Test Reports

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

### Test Results

- **Unit Tests**: Individual component testing
- **Integration Tests**: Service interaction testing
- **E2E Tests**: Full workflow validation
- **Performance Tests**: Response time benchmarks

---

## 🚀 CI/CD Integration

### GitHub Actions

```yaml
- name: Run E2E Tests
  run: |
    cd apps/ebay-service-e2e
    npm install
    npm test
```

### Docker Testing

```bash
# Run tests in Docker environment
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

---

## 🔍 Debugging Tests

### Local Debugging

```bash
# Run tests with debug output
npm run test:debug

# Run specific test file
npm test -- health.e2e-spec.ts

# Run tests with verbose output
npm test -- --verbose
```

### Common Issues

1. **Service Not Running**: Ensure eBay service is available on port 4100
2. **Database Connection**: Verify PostgreSQL is accessible
3. **Cache Issues**: Clear Redis cache between test runs
4. **Timeout Errors**: Increase Jest timeout for slow operations

---

## 📚 Best Practices

### Writing E2E Tests

1. **Test Real Scenarios**: Focus on user workflows
2. **Use Proper Assertions**: Verify both status and response content
3. **Clean Up**: Reset state between tests
4. **Mock External Services**: Avoid dependencies on external APIs
5. **Test Error Cases**: Verify error handling and edge cases

### Test Organization

- **Group Related Tests**: Use `describe` blocks effectively
- **Clear Test Names**: Descriptive test descriptions
- **Setup/Teardown**: Use `beforeEach`/`afterEach` for cleanup
- **Shared Utilities**: Extract common test helpers

---

## 🔗 Related Documentation

- **[eBay Service](../ebay-service/README.md)**: Main service documentation
- **[API Gateway](../api-gateway/README.md)**: Gateway service
- **[Testing Guide](../../docs/testing.md)**: General testing guidelines
- **[CI/CD Pipeline](../../.github/workflows/test.yml)**: Automated testing

---

## 📄 Notes

- This package is **not a deployable service** - it's for testing only
- Tests use workspace path aliases for maintainability
- All external dependencies are mocked for reliable testing
- Test data is isolated and cleaned up automatically
