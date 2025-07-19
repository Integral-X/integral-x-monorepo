# eBay Service End-to-End (e2e) Tests

This package contains end-to-end (e2e) tests for the eBay microservice, separated from the main application code for better maintainability and scalability.

## Structure

```
apps/ebay-service-e2e/
  src/ebay-service/
    health.e2e-spec.ts   # End-to-end tests for eBay service
  package.json           # Independent test runner config
  jest.config.js         # Jest config for e2e
  tsconfig.json          # TypeScript config for e2e
```

## Running e2e Tests

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the tests:
   ```bash
   npm test
   ```

## Notes
- These tests use Jest and Supertest.
- Imports use workspace path aliases for maintainability.
- The e2e package is not a deployable service; it is for testing only. 