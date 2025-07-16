import { EbayListingFormat } from '../entities/ebay-listing.entity';

export interface CreateListingVariationDto {
  variationSku: string;
  price: number;
  quantity: number;
  variationSpecifics: Record<string, string>;
  variationTitle?: string;
  variationImages?: string[];
}

export interface CreateListingShippingDetailsDto {
  shippingType: string;
  shippingServiceCost: number;
  dispatchTimeMax: number;
  domesticShippingService: string;
  internationalShippingService?: string;
}

export interface CreateListingReturnPolicyDto {
  returnsAccepted: boolean;
  returnPeriod: string;
  refundOption: string;
  shippingCostPaidBy: string;
}

export interface CreateListingDto {
  sku: string;
  title: string;
  description?: string;
  price: number;
  quantity: number;
  currency?: string;
  format?: EbayListingFormat;
  condition?: string;
  categoryId?: string;
  images?: string[];
  itemSpecifics?: Record<string, string>;
  shippingDetails?: CreateListingShippingDetailsDto;
  returnPolicy?: CreateListingReturnPolicyDto;
  duration?: number;
  variations?: CreateListingVariationDto[];
  correlationId?: string;
}
