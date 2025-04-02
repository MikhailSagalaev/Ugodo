import { Entity, PrimaryKey, Property, ManyToOne, Index } from '@mikro-orm/core';
import { generateEntityId } from '@medusajs/utils';
import { Story } from './story';

@Entity()
export class StorySlide {
  @PrimaryKey({ columnType: 'varchar' })
  id: string;

  @Property()
  @Index()
  story_id: string;

  @Property()
  image_url: string;

  @Property({ nullable: true })
  title?: string;

  @Property({ nullable: true, columnType: 'text' })
  description?: string;

  @Property({ nullable: true })
  button_text?: string;

  @Property({ nullable: true })
  button_link?: string;

  @Property({ nullable: true })
  @Index()
  display_order: number = 0;

  @Property({ default: true })
  is_active: boolean;

  @ManyToOne(() => Story, { fieldName: 'story_id' })
  story: Story;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP', onUpdate: () => new Date() })
  updated_at: Date;

  constructor(slide: Partial<StorySlide>) {
    if (slide) {
      Object.assign(this, slide);
      
      if (!this.id) {
        this.id = generateEntityId('slide');
      }
    }
  }
} 