import { BaseEntity } from '@medusajs/medusa';
import { Entity, Property, PrimaryKey, OneToMany, Collection } from '@mikro-orm/core';
import { Product } from '@medusajs/medusa/dist/models/product';
import { generateEntityId } from '@medusajs/medusa/dist/utils';

@Entity()
export class Brand extends BaseEntity {
  @PrimaryKey({ columnType: 'varchar' })
  id: string;

  @Property()
  name: string;

  @Property({ nullable: true, columnType: 'text' })
  description?: string;

  @Property({ nullable: true })
  logo_url?: string;

  @Property({ nullable: true })
  website?: string;

  @OneToMany(() => Product, (product) => product.brand, { orphanRemoval: false })
  products = new Collection<Product>(this);

  constructor(brand: Partial<Brand>) {
    super();
    if (brand) {
      Object.assign(this, brand);
      
      if (!this.id) {
        this.id = generateEntityId('brand');
      }
    }
  }
} 