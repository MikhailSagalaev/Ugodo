import { ProductReview } from '../entities/product-review';
import { EntityManager } from '@mikro-orm/core';

export const ProductReviewRepository = {
  async findByProductId(manager: EntityManager, productId: string): Promise<ProductReview[]> {
    return manager.getRepository(ProductReview).find({ 
      product_id: productId,
      published: true 
    }, { 
      orderBy: { created_at: 'DESC' } 
    });
  },

  async findByCustomerId(manager: EntityManager, customerId: string): Promise<ProductReview[]> {
    return manager.getRepository(ProductReview).find({ 
      customer_id: customerId 
    }, { 
      orderBy: { created_at: 'DESC' } 
    });
  },

  async getAverageRating(manager: EntityManager, productId: string): Promise<number | null> {
    const reviews = await manager.getRepository(ProductReview).find({ 
      product_id: productId,
      published: true 
    });
    
    if (reviews.length === 0) {
      return null;
    }
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  },

  async getPositivePercentage(manager: EntityManager, productId: string): Promise<number | null> {
    const total = await manager.getRepository(ProductReview).count({
      product_id: productId,
      published: true
    });
    
    if (!total) return null;
    
    const positive = await manager.getRepository(ProductReview).count({
      product_id: productId,
      published: true,
      rating: { $gte: 4 }
    });
    
    return Math.round((positive / total) * 100);
  }
}; 