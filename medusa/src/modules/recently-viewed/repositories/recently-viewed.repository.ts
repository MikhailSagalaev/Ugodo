import { RecentlyViewed } from '../entities/recently-viewed';
import { EntityManager } from '@mikro-orm/core';

export const RecentlyViewedRepository = {
  async findByCustomerId(
    manager: EntityManager,
    customerId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<[RecentlyViewed[], number]> {
    const [views, count] = await manager.getRepository(RecentlyViewed).findAndCount(
      { customer_id: customerId },
      {
        orderBy: { viewed_at: 'DESC' },
        limit: options.limit,
        offset: options.offset
      }
    );

    return [views, count];
  },

  async findBySessionId(
    manager: EntityManager,
    sessionId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<[RecentlyViewed[], number]> {
    const [views, count] = await manager.getRepository(RecentlyViewed).findAndCount(
      { session_id: sessionId },
      {
        orderBy: { viewed_at: 'DESC' },
        limit: options.limit,
        offset: options.offset
      }
    );

    return [views, count];
  },

  async findProductIdsByCustomerId(
    manager: EntityManager,
    customerId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<string[]> {
    const views = await manager.getRepository(RecentlyViewed).find(
      { customer_id: customerId },
      {
        fields: ['product_id'],
        orderBy: { viewed_at: 'DESC' },
        limit: options.limit,
        offset: options.offset
      }
    );

    return views.map(view => view.product_id);
  },

  async findProductIdsBySessionId(
    manager: EntityManager,
    sessionId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<string[]> {
    const views = await manager.getRepository(RecentlyViewed).find(
      { session_id: sessionId },
      {
        fields: ['product_id'],
        orderBy: { viewed_at: 'DESC' },
        limit: options.limit,
        offset: options.offset
      }
    );

    return views.map(view => view.product_id);
  },

  async addProductView(
    manager: EntityManager,
    data: {
      product_id: string;
      customer_id?: string;
      session_id?: string;
    }
  ): Promise<RecentlyViewed> {
    // Если у нас есть customer_id, сначала ищем по нему
    let existing: RecentlyViewed | null = null;
    
    if (data.customer_id) {
      existing = await manager.getRepository(RecentlyViewed).findOne({
        product_id: data.product_id,
        customer_id: data.customer_id
      });
    } else if (data.session_id) {
      existing = await manager.getRepository(RecentlyViewed).findOne({
        product_id: data.product_id,
        session_id: data.session_id
      });
    }

    // Если запись существует, обновляем время просмотра
    if (existing) {
      existing.viewed_at = new Date();
      await manager.getRepository(RecentlyViewed).persistAndFlush(existing);
      return existing;
    }

    // Иначе создаем новую запись
    const view = new RecentlyViewed({
      product_id: data.product_id,
      customer_id: data.customer_id,
      session_id: data.session_id,
      viewed_at: new Date()
    });

    await manager.getRepository(RecentlyViewed).persistAndFlush(view);
    return view;
  }
}; 