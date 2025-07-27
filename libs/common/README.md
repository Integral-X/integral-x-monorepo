# Common Library

Shared types, utilities, and error handling components for the Integral-X monorepo, providing consistent interfaces and functionality across all services and libraries.

[![Library](https://img.shields.io/badge/type-library-blue)](https://github.com/integral-x/integral-x-monorepo)
[![TypeScript](https://img.shields.io/badge/language-TypeScript-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/framework-NestJS-red)](https://nestjs.com/)

---

## 🚀 Quick Start

### Installation

```bash
# Library is automatically available in the monorepo
import { User, RequestWithUser, AllExceptionsFilter } from '@integral-x/common';
```

### Basic Usage

```typescript
// Using shared types
import { User, RequestWithUser } from "@integral-x/common";

@Controller("users")
export class UsersController {
  @Get("profile")
  getProfile(@Request() req: RequestWithUser): User {
    return req.user;
  }
}

// Using global exception filter
import { AllExceptionsFilter } from "@integral-x/common";

const app = await NestFactory.create(AppModule);
app.useGlobalFilters(new AllExceptionsFilter());
```

---

## 🏗️ Library Structure

### Directory Layout

```
libs/common/
├── src/
│   ├── types.ts                    # Shared TypeScript interfaces
│   ├── utils.ts                    # Utility functions
│   ├── http-exception.filter.ts    # Global error handling
│   └── index.ts                   # Library exports
├── package.json                    # Library dependencies
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

### Core Components

- **📝 Types**: Shared TypeScript interfaces and types
- **🛠️ Utils**: Common utility functions
- **🚨 Exception Filter**: Global error handling for NestJS
- **🔗 Exports**: Centralized library exports

---

## 🔧 API Reference

### Types

#### User Interface

```typescript
export interface User {
  id: string;
  email: string;
  roles: string[];
}
```

**Usage:**

- Consistent user representation across services
- Type safety for user-related operations
- Role-based access control support

#### RequestWithUser Interface

```typescript
export interface RequestWithUser extends Request {
  user?: User;
  correlationId?: string;
}
```

**Usage:**

- Enhanced Express Request with user context
- Correlation ID for request tracing
- Type-safe request handling in controllers

### Utilities

#### Common Utility Functions

```typescript
// Example utility functions (add as needed)
export function generateCorrelationId(): string;
export function sanitizeInput(input: string): string;
export function formatError(error: Error): ErrorResponse;
```

**Features:**

- Input sanitization and validation
- Error formatting and standardization
- Request correlation ID generation
- Common data transformations

### Exception Filter

#### AllExceptionsFilter

Global exception filter for consistent error handling across all NestJS services.

```typescript
import { AllExceptionsFilter } from "@integral-x/common";

// Apply globally
const app = await NestFactory.create(AppModule);
app.useGlobalFilters(new AllExceptionsFilter());
```

**Features:**

- **Consistent Error Format**: Standardized error responses
- **Logging Integration**: Automatic error logging with context
- **HTTP Status Mapping**: Proper HTTP status code handling
- **Request Context**: Includes request URL, method, and correlation ID

**Error Response Format:**

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Detailed error information",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "path": "/api/endpoint"
}
```

---

## 🚨 Error Handling

### Exception Types

The filter handles various exception types:

- **HttpException**: NestJS HTTP exceptions
- **ValidationError**: Request validation failures
- **DatabaseError**: Database operation errors
- **UnhandledException**: Unexpected errors

### Logging Integration

```typescript
// Automatic structured logging
logger.error("Request error", {
  url: request.url,
  method: request.method,
  status: 500,
  message: "Error message",
  error: errorDetails,
  correlationId: "uuid-correlation-id",
});
```

### Security Features

- **Error Sanitization**: Prevents sensitive data leakage
- **Stack Trace Filtering**: Hides internal details in production
- **Rate Limiting Integration**: Works with rate limiting middleware
- **CORS Support**: Proper CORS headers in error responses

---

## 🧪 Testing

### Running Tests

```bash
# Run common library tests
npx nx test @integral-x/common

# Run with coverage
npx nx test @integral-x/common --coverage

# Lint the library
npx nx lint @integral-x/common
```

### Test Coverage

- **Type Definitions**: Interface validation and usage
- **Utility Functions**: Input/output validation
- **Exception Filter**: Error handling scenarios
- **Integration**: Cross-service compatibility

### Example Tests

```typescript
describe("AllExceptionsFilter", () => {
  it("should format HTTP exceptions correctly", () => {
    const exception = new HttpException("Not found", 404);
    const result = filter.catch(exception, mockHost);

    expect(result.statusCode).toBe(404);
    expect(result.message).toBe("Not found");
  });
});
```

---

## 🚀 Usage Examples

### Type-Safe Controllers

```typescript
import { User, RequestWithUser } from "@integral-x/common";

@Controller("api")
export class ApiController {
  @Get("user")
  getCurrentUser(@Request() req: RequestWithUser): User | null {
    return req.user || null;
  }

  @Post("data")
  processData(@Body() data: any, @Request() req: RequestWithUser) {
    const correlationId = req.correlationId;
    // Process with correlation tracking
  }
}
```

### Global Error Handling

```typescript
import { AllExceptionsFilter } from "@integral-x/common";

// In main.ts
const app = await NestFactory.create(AppModule);
app.useGlobalFilters(new AllExceptionsFilter());
```

### Utility Usage

```typescript
import { generateCorrelationId, sanitizeInput } from "@integral-x/common";

@Injectable()
export class DataService {
  processRequest(input: string) {
    const correlationId = generateCorrelationId();
    const cleanInput = sanitizeInput(input);

    // Process with correlation tracking and clean input
  }
}
```

---

## 🔗 Integration

### With API Gateway

```typescript
// apps/api-gateway/src/main.ts
import { AllExceptionsFilter } from "@integral-x/common";

const app = await NestFactory.create(AppModule);
app.useGlobalFilters(new AllExceptionsFilter());
```

### With Microservices

```typescript
// apps/ebay-service/src/main.ts
import { AllExceptionsFilter, RequestWithUser } from "@integral-x/common";

const app = await NestFactory.create(AppModule);
app.useGlobalFilters(new AllExceptionsFilter());
```

### With Other Libraries

```typescript
// Using with auth library
import { User } from "@integral-x/common";
import { JwtAuthGuard } from "@integral-x/auth";

@Controller("protected")
@UseGuards(JwtAuthGuard)
export class ProtectedController {
  @Get()
  getData(@Request() req: RequestWithUser): { user: User } {
    return { user: req.user };
  }
}
```

---

## 📚 Related Libraries

- **[Auth Library](../auth/README.md)**: Authentication and authorization
- **[Observability Library](../observability/README.md)**: Logging and monitoring
- **[Messaging Library](../messaging/README.md)**: Event-driven communication

---

## 🔧 Development

### Adding New Types

```typescript
// In src/types.ts
export interface NewType {
  id: string;
  name: string;
  // ... other properties
}
```

### Adding Utilities

```typescript
// In src/utils.ts
export function newUtilityFunction(input: string): string {
  // Implementation
  return processedInput;
}
```

### Contributing

1. **Type Safety**: Ensure all new types are properly defined
2. **Documentation**: Add JSDoc comments for new functions
3. **Testing**: Include tests for new utilities
4. **Backward Compatibility**: Maintain existing interfaces

---

## 📄 License

Copyright (c) 2025 Integral-X. All rights reserved.
