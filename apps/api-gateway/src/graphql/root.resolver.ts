/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { Query, Resolver } from "@nestjs/graphql";

@Resolver()
export class RootResolver {
  @Query(() => String)
  health(): string {
    return "ok";
  }
}
