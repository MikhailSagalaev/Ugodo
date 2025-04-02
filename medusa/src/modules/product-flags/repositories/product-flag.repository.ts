import { ProductFlag, ProductFlagType } from '../entities/product-flag';
import { EntityManager } from '@mikro-orm/core';

export const ProductFlagRepository = {
  async findByProductAndType(
    manager: EntityManager,
    productId: string,
    type: ProductFlagType
  ): Promise<ProductFlag | null> {
    return manager.getRepository(ProductFlag).findOne({
      product_id: productId,
      type,
      is_active: true
    });
  },

  async findByType(
    manager: EntityManager,
    type: ProductFlagType,
    options: { limit?: number; offset?: number } = {}
  ): Promise<[ProductFlag[], number]> {
    const [flags, count] = await manager.getRepository(ProductFlag).findAndCount(
      {
        type,
        is_active: true
      },
      {
        orderBy: { created_at: 'DESC' },
        limit: options.limit,
        offset: options.offset
      }
    );

    return [flags, count];
  },

  async findProductIdsByType(
    manager: EntityManager,
    type: ProductFlagType,
    options: { limit?: number; offset?: number } = {}
  ): Promise<string[]> {
    const flags = await manager.getRepository(ProductFlag).find(
      {
        type,
        is_active: true
      },
      {
        fields: ['product_id'],
        orderBy: { created_at: 'DESC' },
        limit: options.limit,
        offset: options.offset
      }
    );

    return flags.map(flag => flag.product_id);
  },

  async findById(manager: EntityManager, id: string): Promise<ProductFlag | null> {
    return manager.getRepository(ProductFlag).findOne({ id });
  },

  async removeProductFlags(
    manager: EntityManager,
    productId: string,
    type?: ProductFlagType
  ): Promise<void> {
    const filter: Partial<ProductFlag> = { product_id: productId };
    
    if (type) {
      filter.type = type;
    }
    
    await manager.getRepository(ProductFlag).nativeDelete(filter);
  }
}; 