import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { EbayListing } from './ebay-listing.entity';

@Entity('ebay_listing_variations')
@Index(['listingId'])
@Index(['variationSku'])
export class EbayListingVariation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  listingId!: string;

  @Column({ type: 'varchar', length: 100 })
  variationSku!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'int', default: 1 })
  quantity!: number;

  @Column({ type: 'json' })
  variationSpecifics!: Record<string, string>; // e.g., { "Color": "Red", "Size": "Large" }

  @Column({ type: 'varchar', length: 255, nullable: true })
  variationTitle?: string;

  @Column({ type: 'json', nullable: true })
  variationImages?: string[];

  @ManyToOne(() => EbayListing, listing => listing.variations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listingId' })
  listing!: EbayListing;

  // Helper methods
  getVariationKey(): string {
    return Object.entries(this.variationSpecifics)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${value}`)
      .join('|');
  }

  hasImages(): boolean {
    return Boolean(this.variationImages && this.variationImages.length > 0);
  }

  isInStock(): boolean {
    return this.quantity > 0;
  }
}
