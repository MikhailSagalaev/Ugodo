import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/core';
import { generateEntityId } from '@medusajs/utils';

@Entity()
export class RecentlyViewed {
  @PrimaryKey({ columnType: 'varchar' })
  id: string;

  @Property()
  @Index()
  customer_id?: string;

  @Property()
  @Index()
  session_id?: string;

  @Property()
  @Index()
  product_id: string;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  viewed_at: Date;

  constructor(viewed: Partial<RecentlyViewed>) {
    if (viewed) {
      Object.assign(this, viewed);
      
      if (!this.id) {
        this.id = generateEntityId('rview');
      }
    }
  }
} 