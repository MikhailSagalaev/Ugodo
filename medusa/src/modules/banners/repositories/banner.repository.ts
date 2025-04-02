import { Banner } from '../entities/banner';
import { EntityManager } from '@mikro-orm/core';

export const BannerRepository = {
  async findActive(manager: EntityManager): Promise<Banner[]> {
    return manager.getRepository(Banner).find(
      { is_active: true },
      {
        orderBy: { display_order: 'ASC', created_at: 'DESC' }
      }
    );
  },

  async findById(manager: EntityManager, id: string): Promise<Banner | null> {
    return manager.getRepository(Banner).findOne({ id });
  },

  async find(
    manager: EntityManager,
    filter: Partial<Banner> = {},
    options: { limit?: number; offset?: number } = {}
  ): Promise<[Banner[], number]> {
    const [banners, count] = await manager.getRepository(Banner).findAndCount(
      filter,
      {
        orderBy: { display_order: 'ASC', created_at: 'DESC' },
        limit: options.limit,
        offset: options.offset
      }
    );

    return [banners, count];
  }
}; 