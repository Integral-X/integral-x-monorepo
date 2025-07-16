import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateListingDto } from '../dto/create-listing.dto';
import { EbayListing } from '../entities/ebay-listing.entity';
import { EbayAdapter } from '../adapters/ebay.adapter';

@Injectable()
export class ListingService {
  private readonly logger = new Logger(ListingService.name);

  constructor(
    @InjectRepository(EbayListing)
    private readonly listingRepository: Repository<EbayListing>,
    private readonly ebayAdapter: EbayAdapter
  ) {}

  async createListing(createListingDto: CreateListingDto): Promise<EbayListing> {
    this.logger.log(`Creating listing for SKU: ${createListingDto.sku}`);

    try {
      // Create listing entity
      const listing = new EbayListing();
      listing.sku = createListingDto.sku;
      listing.title = createListingDto.title;
      listing.description = createListingDto.description;
      listing.price = createListingDto.price;
      listing.quantity = createListingDto.quantity;
      listing.currency = createListingDto.currency || 'USD';
      listing.format = createListingDto.format || listing.format;
      listing.condition = createListingDto.condition;
      listing.categoryId = createListingDto.categoryId;
      listing.images = createListingDto.images;
      listing.itemSpecifics = createListingDto.itemSpecifics;
      listing.shippingDetails = createListingDto.shippingDetails;
      listing.returnPolicy = createListingDto.returnPolicy;
      listing.duration = createListingDto.duration || 30;

      // Save to database first
      const savedListing = await this.listingRepository.save(listing);
      this.logger.log(`Saved listing to database with ID: ${savedListing.id}`);

      // Call eBay API
      const ebayResponse = await this.ebayAdapter.createListing(
        createListingDto,
        createListingDto.correlationId
      );

      if (ebayResponse.success && ebayResponse.data) {
        // Update listing with eBay response
        savedListing.ebayItemId = ebayResponse.data.itemId;
        savedListing.status = ebayResponse.data.status as any;
        savedListing.ebayResponse = ebayResponse.data;
        savedListing.markSyncSuccess();

        await this.listingRepository.save(savedListing);
        this.logger.log(`Successfully created eBay listing: ${ebayResponse.data.itemId}`);
      } else {
        // Mark as error
        const errorMessage = ebayResponse.error?.message || 'Unknown eBay API error';
        savedListing.markSyncError(errorMessage);
        await this.listingRepository.save(savedListing);
        
        throw new Error(`eBay API error: ${errorMessage}`);
      }

      return savedListing;
    } catch (error) {
      this.logger.error(`Failed to create listing for SKU: ${createListingDto.sku}`, error);
      throw error;
    }
  }
}
