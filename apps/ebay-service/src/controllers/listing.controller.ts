import { Controller, Post, Body, Logger } from '@nestjs/common';
import { CreateListingDto } from '../dto/create-listing.dto';
import { ListingService } from '../services/listing.service';

@Controller('listings')
export class ListingController {
  private readonly logger = new Logger(ListingController.name);

  constructor(private readonly listingService: ListingService) {}

  @Post()
  async createListing(@Body() createListingDto: CreateListingDto) {
    this.logger.log(`Creating listing for SKU: ${createListingDto.sku}`);
    
    try {
      const result = await this.listingService.createListing(createListingDto);
      this.logger.log(`Successfully created listing for SKU: ${createListingDto.sku}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create listing for SKU: ${createListingDto.sku}`, error);
      throw error;
    }
  }
}
