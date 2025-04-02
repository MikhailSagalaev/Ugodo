import { Story } from '../entities/story';
import { EntityManager } from '@mikro-orm/core';

export const StoryRepository = {
  async findActive(manager: EntityManager): Promise<Story[]> {
    return manager.getRepository(Story).find(
      { is_active: true },
      {
        orderBy: { display_order: 'ASC', created_at: 'DESC' },
        populate: ['slides']
      }
    );
  },

  async findById(manager: EntityManager, id: string): Promise<Story | null> {
    return manager.getRepository(Story).findOne(
      { id },
      { populate: ['slides'] }
    );
  },

  async find(
    manager: EntityManager,
    filter: Partial<Story> = {},
    options: { limit?: number; offset?: number; populate?: string[] } = {}
  ): Promise<[Story[], number]> {
    const populateFields = options.populate || ['slides'];
    
    const [stories, count] = await manager.getRepository(Story).findAndCount(
      filter,
      {
        orderBy: { display_order: 'ASC', created_at: 'DESC' },
        limit: options.limit,
        offset: options.offset,
        populate: populateFields
      }
    );

    return [stories, count];
  }
}; 