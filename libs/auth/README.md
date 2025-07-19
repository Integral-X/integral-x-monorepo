# Auth Library

This library provides authentication logic (JWT, guards, modules) for use across services in the Integral-X monorepo.

## Structure

```
libs/auth/
  src/
    auth.guard.ts         # JWT Auth Guard for NestJS
    auth.guard.spec.ts    # Unit tests for the guard
    auth.module.ts        # Auth module for NestJS
  package.json
  tsconfig.json
```

## Usage
- Import the AuthModule or AuthGuard from `@integral-x/auth` in your NestJS services.
- Centralizes authentication logic for consistency and security. 