import { Query, Resolver } from '@nestjs/graphql';

@Resolver('Marketplace')
export class MarketplaceResolver {
  @Query(() => String, { description: 'Placeholder for marketplace integration' })
  marketplaceStatus(): string {
    return 'marketplace integration coming soon';
  }
} 