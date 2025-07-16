import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './modules/health.module';
import { ListingModule } from './modules/listing.module';
import { validationSchema } from './config/validation';
import { getTypeOrmConfig } from './db/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? [] : '.env',
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getTypeOrmConfig(configService),
      inject: [ConfigService],
    }),
    HealthModule,
    ListingModule,
  ],
})
export class AppModule {}
