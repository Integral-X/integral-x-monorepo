/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { IsString, IsNotEmpty } from "class-validator";

export class GetProductByIdRequestDto {
  /**
   * The unique identifier of the product to be fetched.
   * @type {string}
   * @example '12345'
   */
  @IsString()
  @IsNotEmpty()
  id!: string;
}
