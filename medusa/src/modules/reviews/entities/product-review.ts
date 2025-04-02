import { BaseEntity } from '@medusajs/medusa';
import { Entity, ManyToOne, Property, PrimaryKey, Index } from '@mikro-orm/core';
import { Product } from '@medusajs/medusa/dist/models/product';
import { Customer } from '@medusajs/medusa/dist/models/customer';
import { generateEntityId } from '@medusajs/medusa/dist/utils';

@Entity()
export class ProductReview extends BaseEntity {
  @PrimaryKey({ columnType: 'varchar' })
  id: string;

  @Property()
  @Index()
  product_id: string;

  @Property({ nullable: true })
  customer_id?: string;

  @Property({ columnType: 'int', check: 'rating BETWEEN 1 AND 5' })
  rating: number;

  @Property({ nullable: true })
  title?: string;

  @Property({ columnType: 'text', nullable: true })
  content?: string;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Property({ default: true })
  published: boolean;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => Customer, { nullable: true })
  customer?: Customer;

  constructor(review: Partial<ProductReview>) {
    super();
    if (review) {
      Object.assign(this, review);
      
      if (!this.id) {
        this.id = generateEntityId('prev');
      }
    }
  }
} 