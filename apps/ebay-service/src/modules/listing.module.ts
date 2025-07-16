import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingController } from '../controllers/listing.controller';
import { ListingService } from '../services/listing.service';
import { EbayListing } from '../entities/ebay-listing.entity';
import { EbayListingVariation } from '../entities/ebay-listing-variation.entity';
import { EbayAdapter } from '../adapters/ebay.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([EbayListing, EbayListingVariation])
  ],
  controllers: [ListingController],
  providers: [ListingService, EbayAdapter],
  exports: [ListingService]
})
export class ListingModule {}
