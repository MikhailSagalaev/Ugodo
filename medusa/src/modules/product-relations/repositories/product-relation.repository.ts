import { ProductRelation, RelationType } from '../entities/product-relation';
import { EntityManager } from '@mikro-orm/core';

export const ProductRelationRepository = {
  async findRelatedProducts(manager: EntityManager, productId: string, type?: RelationType): Promise<ProductRelation[]> {
    const whereCondition: any = {
      from_product_id: productId,
      is_active: true
    };
    
    if (type) {
      whereCondition.type = type;
    }
    
    return manager.getRepository(ProductRelation).find(
      whereCondition,
      { 
        orderBy: { position: 'ASC', created_at: 'DESC' } 
      }
    );
  },
  
  async findProductsRelatedTo(manager: EntityManager, productId: string, type?: RelationType): Promise<ProductRelation[]> {
    const whereCondition: any = {
      to_product_id: productId,
      is_active: true
    };
    
    if (type) {
      whereCondition.type = type;
    }
    
    return manager.getRepository(ProductRelation).find(
      whereCondition,
      { 
        orderBy: { position: 'ASC', created_at: 'DESC' } 
      }
    );
  },
  
  async findRelation(manager: EntityManager, fromProductId: string, toProductId: string, type: RelationType): Promise<ProductRelation | null> {
    return manager.getRepository(ProductRelation).findOne({
      from_product_id: fromProductId,
      to_product_id: toProductId,
      type
    });
  },
  
  async countRelations(manager: EntityManager, productId: string, type?: RelationType): Promise<number> {
    const whereCondition: any = {
      from_product_id: productId
    };
    
    if (type) {
      whereCondition.type = type;
    }
    
    return manager.getRepository(ProductRelation).count(whereCondition);
  }
}; 