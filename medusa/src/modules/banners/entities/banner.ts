import { Entity, PrimaryKey, Property, Unique, Index } from '@mikro-orm/core';
import { generateEntityId } from '@medusajs/utils';

@Entity()
export class Banner {
  @PrimaryKey({ columnType: 'varchar' })
  id: string;

  @Property()
  title: string;

  @Property({ nullable: true })
  subtitle?: string;

  @Property({ nullable: true })
  button_text?: string;

  @Property({ nullable: true })
  button_link?: string;

  @Property()
  image_url: string;

  @Property({ nullable: true })
  @Index()
  display_order: number = 0;

  @Property({ default: true })
  is_active: boolean;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP', onUpdate: () => new Date() })
  updated_at: Date;

  constructor(banner: Partial<Banner>) {
    if (banner) {
      Object.assign(this, banner);
      
      if (!this.id) {
        this.id = generateEntityId('banner');
      }
    }
  }
} 