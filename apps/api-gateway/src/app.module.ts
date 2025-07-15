import { Module } from '@nestjs/common';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { HealthModule } from './health.module';
import { AuthModule } from './auth.module';
import { RootResolver } from './graphql/root.resolver';
import { MarketplaceResolver } from './graphql/marketplace.resolver';

@Module({
  imports: [
    GraphQLFederationModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/api-gateway/src/graphql/schema.gql'),
      playground: true,
      introspection: true,
      context: ({ req }) => ({ req }),
    }),
    HealthModule,
    AuthModule,
  ],
  providers: [RootResolver, MarketplaceResolver],
})
export class AppModule {} 