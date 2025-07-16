import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { EbayListingVariation } from './ebay-listing-variation.entity';

export enum EbayListingStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ENDED = 'ended',
  SUSPENDED = 'suspended',
  SOLD = 'sold',
  ERROR = 'error'
}

export enum EbayListingFormat {
  AUCTION = 'auction',
  FIXED_PRICE = 'fixed_price',
  CLASSIFIED_AD = 'classified_ad'
}

@Entity('ebay_listings')
@Index(['sku'])
@Index(['ebayItemId'])
@Index(['status'])
@Index(['createdAt'])
export class EbayListing {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  sku!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ebayItemId?: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'int', default: 1 })
  quantity!: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency!: string;

  @Column({ type: 'enum', enum: EbayListingStatus, default: EbayListingStatus.DRAFT })
  status!: EbayListingStatus;

  @Column({ type: 'enum', enum: EbayListingFormat, default: EbayListingFormat.FIXED_PRICE })
  format!: EbayListingFormat;

  @Column({ type: 'varchar', length: 20, nullable: true })
  condition?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  categoryId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  categoryName?: string;

  @Column({ type: 'json', nullable: true })
  images?: string[];

  @Column({ type: 'json', nullable: true })
  itemSpecifics?: Record<string, string>;

  @Column({ type: 'json', nullable: true })
  shippingDetails?: {
    shippingType: string;
    shippingServiceCost: number;
    dispatchTimeMax: number;
    domesticShippingService: string;
    internationalShippingService?: string;
  };

  @Column({ type: 'json', nullable: true })
  returnPolicy?: {
    returnsAccepted: boolean;
    returnPeriod: string;
    refundOption: string;
    shippingCostPaidBy: string;
  };

  @Column({ type: 'int', default: 30 })
  duration!: number;

  @Column({ type: 'timestamp', nullable: true })
  startTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncedAt?: Date;

  @Column({ type: 'text', nullable: true })
  lastSyncError?: string;

  @Column({ type: 'int', default: 0 })
  syncAttempts!: number;

  @Column({ type: 'json', nullable: true })
  ebayResponse?: Record<string, any>;

  @OneToMany(() => EbayListingVariation, variation => variation.listing, { cascade: true })
  variations!: EbayListingVariation[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Helper methods
  isActive(): boolean {
    return this.status === EbayListingStatus.ACTIVE;
  }

  canBeUpdated(): boolean {
    return [EbayListingStatus.DRAFT, EbayListingStatus.ACTIVE].includes(this.status);
  }

  hasVariations(): boolean {
    return this.variations && this.variations.length > 0;
  }

  incrementSyncAttempts(): void {
    this.syncAttempts += 1;
  }

  resetSyncAttempts(): void {
    this.syncAttempts = 0;
    this.lastSyncError = undefined;
  }

  markSyncSuccess(): void {
    this.lastSyncedAt = new Date();
    this.resetSyncAttempts();
  }

  markSyncError(error: string): void {
    this.lastSyncError = error;
    this.incrementSyncAttempts();
  }
}
