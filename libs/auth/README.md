# Auth Library

Centralized authentication utilities for the Integral-X monorepo, providing JWT-based authentication, guards, and modules for consistent security across all services.

[![Library](https://img.shields.io/badge/type-library-blue)](https://github.com/integral-x/integral-x-monorepo)
[![JWT](https://img.shields.io/badge/auth-JWT-green)](https://jwt.io/)
[![NestJS](https://img.shields.io/badge/framework-NestJS-red)](https://nestjs.com/)

---

## 🚀 Quick Start

### Installation

```bash
# Library is automatically available in the monorepo
import { AuthModule, JwtAuthGuard } from '@integral-x/auth';
```

### Basic Usage

```typescript
// In your NestJS module
import { AuthModule } from "@integral-x/auth";

@Module({
  imports: [AuthModule],
  // ...
})
export class YourModule {}

// In your controller
import { JwtAuthGuard } from "@integral-x/auth";

@Controller("protected")
@UseGuards(JwtAuthGuard)
export class ProtectedController {
  @Get()
  getProtectedData(@Request() req) {
    return { user: req.user };
  }
}
```

---

## 🏗️ Library Structure

### Directory Layout

```
libs/auth/
├── src/
│   ├── auth.guard.ts       # JWT authentication guard
│   ├── auth.module.ts      # NestJS authentication module
│   └── index.ts           # Library exports
├── __test__/
│   └── auth.guard.spec.ts  # Unit tests
├── package.json            # Library dependencies
├── tsconfig.json          # TypeScript configuration
├── jest.config.js         # Jest test configuration
└── README.md              # This file
```

### Core Components

- **🔐 JwtAuthGuard**: Request authentication guard
- **📦 AuthModule**: NestJS module for authentication setup
- **🧪 Test Suite**: Comprehensive unit tests

---

## 🔧 API Reference

### JwtAuthGuard

JWT-based authentication guard for protecting NestJS routes.

```typescript
import { JwtAuthGuard } from "@integral-x/auth";

@Controller("api")
export class ApiController {
  @Get("protected")
  @UseGuards(JwtAuthGuard)
  getProtectedResource(@Request() req) {
    // req.user contains decoded JWT payload
    return { message: "Access granted", user: req.user };
  }
}
```

**Features:**

- Validates JWT tokens from `Authorization` header
- Extracts user information from token payload
- Throws `UnauthorizedException` for invalid/missing tokens
- Supports Bearer token format: `Authorization: Bearer <token>`

### AuthModule

NestJS module providing authentication services and configuration.

```typescript
import { AuthModule } from "@integral-x/auth";

@Module({
  imports: [
    AuthModule.forRoot({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
    }),
  ],
})
export class AppModule {}
```

**Configuration Options:**

- `secret`: JWT signing secret (required)
- `signOptions`: Token signing options (optional)
- `verifyOptions`: Token verification options (optional)

---

## 🔐 Security Features

### Token Validation

- **Format Validation**: Ensures proper Bearer token format
- **Signature Verification**: Validates JWT signature
- **Expiration Check**: Verifies token hasn't expired
- **Payload Extraction**: Safely extracts user data

### Error Handling

```typescript
// Automatic error responses for:
// - Missing Authorization header
// - Invalid token format
// - Expired tokens
// - Invalid signatures

{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Invalid or expired token"
}
```

### Best Practices

1. **Environment Variables**: Store JWT secrets securely
2. **Token Expiration**: Use reasonable expiration times
3. **HTTPS Only**: Always use HTTPS in production
4. **Refresh Tokens**: Implement token refresh mechanism
5. **Rate Limiting**: Combine with rate limiting for protection

---

## 🧪 Testing

### Running Tests

```bash
# Run auth library tests
npx nx test @integral-x/auth

# Run with coverage
npx nx test @integral-x/auth --coverage

# Run in watch mode
npx nx test @integral-x/auth --watch
```

### Test Coverage

- **Guard Functionality**: Token validation and user extraction
- **Error Scenarios**: Invalid tokens, missing headers
- **Integration**: NestJS integration testing
- **Security**: Edge cases and attack vectors

### Example Test

```typescript
describe("JwtAuthGuard", () => {
  it("should allow access with valid token", async () => {
    const token = jwt.sign({ userId: "123" }, "secret");
    const request = {
      headers: { authorization: `Bearer ${token}` },
    };

    const result = guard.canActivate(createMockContext(request));
    expect(result).toBe(true);
  });
});
```

---

## 🚀 Usage Examples

### Basic Protection

```typescript
@Controller("users")
export class UsersController {
  @Get("profile")
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }
}
```

### Role-Based Access

```typescript
@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
export class AdminController {
  @Get("users")
  getAllUsers() {
    return this.usersService.findAll();
  }
}
```

### Global Authentication

```typescript
// Apply to all routes globally
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new JwtAuthGuard(reflector));
```

---

## 🔗 Integration

### With API Gateway

```typescript
// apps/api-gateway/src/app.module.ts
import { AuthModule } from "@integral-x/auth";

@Module({
  imports: [
    AuthModule,
    // other modules...
  ],
})
export class AppModule {}
```

### With Microservices

```typescript
// apps/ebay-service/src/app.module.ts
import { AuthModule } from "@integral-x/auth";

@Module({
  imports: [
    AuthModule,
    // other modules...
  ],
})
export class AppModule {}
```

---

## 📚 Related Libraries

- **[Common Library](../common/README.md)**: Shared types and utilities
- **[Observability Library](../observability/README.md)**: Logging and monitoring
- **[Messaging Library](../messaging/README.md)**: Event-driven communication

---

## 🔧 Development

### Building the Library

```bash
# Build the auth library
npx nx build @integral-x/auth

# Lint the library
npx nx lint @integral-x/auth
```

### Contributing

1. **Add Tests**: Ensure new features have test coverage
2. **Update Types**: Maintain TypeScript definitions
3. **Document Changes**: Update README for new features
4. **Security Review**: Have security changes reviewed

---

## 📄 License

Copyright (c) 2025 Integral-X. All rights reserved.
