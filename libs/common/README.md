# Common Library

This library contains shared types, error handling, and utility functions used across multiple services in the Integral-X monorepo.

## Structure

```
libs/common/
  src/
    types.ts                # Shared TypeScript types
    utils.ts                # Utility functions
    http-exception.filter.ts # Global error handling for NestJS
  package.json
  tsconfig.json
```

## Usage
- Import shared types and utilities from `@integral-x/common` in your services or libraries.
- Centralizes code reuse and reduces duplication. 