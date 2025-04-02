import { Entity, PrimaryKey, Property, OneToMany, Collection, Index } from '@mikro-orm/core';
import { generateEntityId } from '@medusajs/utils';
import { StorySlide } from './story-slide';

@Entity()
export class Story {
  @PrimaryKey({ columnType: 'varchar' })
  id: string;

  @Property()
  title: string;

  @Property()
  icon_url: string;

  @Property({ nullable: true })
  icon_background_color?: string;

  @Property({ nullable: true })
  @Index()
  display_order: number = 0;

  @Property({ default: true })
  is_active: boolean;

  @OneToMany(() => StorySlide, slide => slide.story, { orphanRemoval: true })
  slides = new Collection<StorySlide>(this);

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP', onUpdate: () => new Date() })
  updated_at: Date;

  constructor(story: Partial<Story>) {
    if (story) {
      Object.assign(this, story);
      
      if (!this.id) {
        this.id = generateEntityId('story');
      }
    }
  }
} 