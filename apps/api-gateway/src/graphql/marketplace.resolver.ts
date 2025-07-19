/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { Query, Resolver } from "@nestjs/graphql";

@Resolver("Marketplace")
export class MarketplaceResolver {
  @Query(() => String, {
    description: "Placeholder for marketplace integration",
  })
  marketplaceStatus(): string {
    return "marketplace integration coming soon";
  }
}
