/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { validationSchema } from "../config/validation";
import { ProductController } from "../controllers/product.controller";
import { ProductService } from "../services/product.service";
import { ProductRepository } from "../repositories/product.repository";
import { ProductCacheService } from "../cache/product.cache.service";
import { EbayApiAdapter } from "../external/ebay-api.adapter";
import { ProductConsumer } from "../kafka/consumers/product.consumer";
import { ProductProducer } from "../kafka/producers/product.producer";
import { ProductEntity } from "../entities/product.entity";
import { redisProvider } from "../config/redis.config";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    ConfigModule.forRoot({
      validationSchema,
      envFilePath: ".env",
      isGlobal: true,
    }),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    ProductCacheService,
    EbayApiAdapter,
    ProductConsumer,
    ProductProducer,
    redisProvider,
  ],
})
export class ProductModule {}
