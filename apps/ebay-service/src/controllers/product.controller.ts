/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { Controller, Get, Param, NotFoundException } from "@nestjs/common";
import { ProductService } from "../services/product.service";
import { GetProductByIdRequestDto } from "../dto/request/get-product-by-id.request.dto";
import { GetProductByIdResponseDto } from "../dto/response/get-product-by-id.response.dto";
import { ProductMapper } from "../mappers/product.mapper";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * GET /products/:id
   * @param {GetProductByIdRequestDto} params - The request parameters.
   * @returns {Promise<GetProductByIdResponseDto>} The product.
   */
  @Get(":id")
  async getProductById(
    @Param() params: GetProductByIdRequestDto,
  ): Promise<GetProductByIdResponseDto> {
    const product = await this.productService.getProductById(params.id);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return ProductMapper.toDto(product, product.source);
  }
}
