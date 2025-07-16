import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { HealthModule } from './health.module';
import { AuthModule } from './auth.module';
import { RootResolver } from './graphql/root.resolver';
import { MarketplaceResolver } from './graphql/marketplace.resolver';
import { validationSchema } from './config/validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? [] : '.env',
      isGlobal: true,
      validationSchema,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/api-gateway/src/graphql/schema.gql'),
      playground: true,
      introspection: true,
      context: ({ req }: { req: Request }) => ({ req }),
    }),
    HealthModule,
    AuthModule,
  ],
  providers: [RootResolver, MarketplaceResolver],
})
export class AppModule {} 