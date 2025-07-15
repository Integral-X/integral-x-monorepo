# API Gateway

## Federation

This API Gateway is ready for Apollo Federation. To add a new federated service:
1. Implement the service using Apollo Federation (e.g., @nestjs/graphql with federation support).
2. Register the service in the gateway's schema and resolvers.
3. Update the gateway's GraphQL schema as needed.

## Error Handling

- All errors are handled by a global NestJS ExceptionFilter (`AllExceptionsFilter`).
- Errors are logged and returned in a consistent format.

## Rate Limiting

- Global rate limiting is applied using express-rate-limit.
- Configurable in `src/rate-limit.ts`.
- For distributed rate limiting, integrate Redis (see commented code in `rate-limit.ts`). 