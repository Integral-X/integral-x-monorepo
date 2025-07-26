/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { JwtAuthGuard } from "../src/auth.guard";
import { JwtService } from "@nestjs/jwt";
import { createMock } from "@golevelup/ts-jest";
import { ExecutionContext } from "@nestjs/common";

describe("JwtAuthGuard", () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({ secret: "test-secret" });
    guard = new JwtAuthGuard(jwtService);
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  it("should allow access for valid token", () => {
    const token = jwtService.sign({ userId: 1 });
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: `Bearer ${token}` },
        }),
      }),
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it("should throw UnauthorizedException for missing token", () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
    });

    expect(() => guard.canActivate(context)).toThrow(
      "Missing Authorization header",
    );
  });

  it("should throw UnauthorizedException for invalid token", () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: "Bearer invalid-token" },
        }),
      }),
    });

    expect(() => guard.canActivate(context)).toThrow(
      "Invalid or expired token",
    );
  });
});
