import { Entity, PrimaryKey, Property, ManyToOne, Enum, Index } from '@mikro-orm/core';
import { generateEntityId } from '@medusajs/utils';

export enum RelationType {
  SIMILAR = 'similar',           // Похожие товары
  ACCESSORY = 'accessory',       // Аксессуары
  BOUGHT_TOGETHER = 'bought_together', // С этим товаром покупают
  COMPLEMENT = 'complement',     // Дополняющие товары
  SUBSTITUTE = 'substitute',     // Заменяющие товары
  UPSELL = 'upsell',             // Товары для увеличения чека
  CROSS_SELL = 'cross_sell'      // Товары для перекрестных продаж
}

@Entity()
export class ProductRelation {
  @PrimaryKey({ columnType: 'varchar' })
  id: string;

  @Property()
  @Index()
  from_product_id: string;

  @Property()
  @Index()
  to_product_id: string;

  @Enum(() => RelationType)
  type: RelationType;

  @Property({ nullable: true, columnType: 'integer', default: 0 })
  position: number;

  @Property({ nullable: true, default: true })
  is_active: boolean;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  constructor(relation: Partial<ProductRelation>) {
    if (relation) {
      Object.assign(this, relation);
      
      if (!this.id) {
        this.id = generateEntityId('prel');
      }
    }
  }
} 