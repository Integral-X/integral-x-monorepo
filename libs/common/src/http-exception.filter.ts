/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { logger } from "@integral-x/observability";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let error = exception;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      error = exception.getResponse();
    }

    logger.error("Request error", {
      url: request.url,
      method: request.method,
      status,
      message,
      error,
    });

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
