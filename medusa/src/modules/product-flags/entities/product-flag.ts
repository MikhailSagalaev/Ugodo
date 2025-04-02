import { Entity, PrimaryKey, Property, Index, Enum } from '@mikro-orm/core';
import { generateEntityId } from '@medusajs/utils';

export enum ProductFlagType {
  NEW = 'new',                  // Новинки
  PROMOTION = 'promotion',      // Акции
  POPULAR = 'popular',          // Популярное
  EXPRESS = 'express',          // Экспресс-доставка
  BESTSELLER = 'bestseller',    // Хиты продаж
  RECENTLY_VIEWED = 'recently_viewed' // Недавно просмотренные
}

@Entity()
export class ProductFlag {
  @PrimaryKey({ columnType: 'varchar' })
  id: string;

  @Property()
  @Index()
  product_id: string;

  @Enum(() => ProductFlagType)
  type: ProductFlagType;

  @Property({ nullable: true })
  metadata: Record<string, unknown>;

  @Property({ default: true })
  is_active: boolean;

  @Property({ nullable: true })
  valid_until?: Date;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP', onUpdate: () => new Date() })
  updated_at: Date;

  constructor(flag: Partial<ProductFlag>) {
    if (flag) {
      Object.assign(this, flag);
      
      if (!this.id) {
        this.id = generateEntityId('flag');
      }
    }
  }
} 