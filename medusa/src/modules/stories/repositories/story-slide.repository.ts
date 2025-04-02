import { StorySlide } from '../entities/story-slide';
import { EntityManager } from '@mikro-orm/core';

export const StorySlideRepository = {
  async findByStoryId(manager: EntityManager, storyId: string): Promise<StorySlide[]> {
    return manager.getRepository(StorySlide).find(
      { 
        story_id: storyId,
        is_active: true 
      },
      {
        orderBy: { display_order: 'ASC', created_at: 'ASC' }
      }
    );
  },

  async findById(manager: EntityManager, id: string): Promise<StorySlide | null> {
    return manager.getRepository(StorySlide).findOne(
      { id },
      { populate: ['story'] }
    );
  },

  async find(
    manager: EntityManager,
    filter: Partial<StorySlide> = {},
    options: { limit?: number; offset?: number } = {}
  ): Promise<[StorySlide[], number]> {
    const [slides, count] = await manager.getRepository(StorySlide).findAndCount(
      filter,
      {
        orderBy: { display_order: 'ASC', created_at: 'ASC' },
        limit: options.limit,
        offset: options.offset
      }
    );

    return [slides, count];
  }
}; 