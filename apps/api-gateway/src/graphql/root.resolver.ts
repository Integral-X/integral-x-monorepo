import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class RootResolver {
  @Query(() => String)
  health(): string {
    return 'ok';
  }
} 