import { TransactionBaseService } from "@medusajs/medusa";
import { ProductReview } from "../entities/product-review";
import { EntityManager } from "@mikro-orm/core";
import { ProductService } from "@medusajs/medusa";
import { MedusaError } from "@medusajs/utils";

type CreateReviewInput = {
  product_id: string;
  customer_id?: string;
  rating: number;
  title?: string;
  content?: string;
  published?: boolean;
};

type UpdateReviewInput = {
  rating?: number;
  title?: string;
  content?: string;
  published?: boolean;
};

export default class ProductReviewService extends TransactionBaseService {
  private manager_: EntityManager;
  private productService_: ProductService;

  constructor({
    manager,
    productService,
  }) {
    super(arguments[0]);
    this.manager_ = manager;
    this.productService_ = productService;
  }

  async create(data: CreateReviewInput): Promise<ProductReview> {
    return this.atomicPhase_(async (manager) => {
      const reviewRepo = manager.getRepository(ProductReview);
      
      // Проверяем, существует ли товар
      await this.productService_.retrieve(data.product_id);

      // Создаем отзыв
      const review = new ProductReview({
        ...data,
        published: data.published ?? true,
      });

      const result = await reviewRepo.save(review);
      
      // Обновляем счетчики и рейтинги товара (можно сделать через метаданные продукта)
      await this.updateProductRatingMetadata(data.product_id);
      
      return result;
    });
  }

  async retrieve(reviewId: string): Promise<ProductReview> {
    const reviewRepo = this.manager_.getRepository(ProductReview);
    const review = await reviewRepo.findOne(reviewId);

    if (!review) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Review with id: ${reviewId} was not found`
      );
    }

    return review;
  }

  async update(
    reviewId: string,
    data: UpdateReviewInput
  ): Promise<ProductReview> {
    return this.atomicPhase_(async (manager) => {
      const reviewRepo = manager.getRepository(ProductReview);
      const review = await this.retrieve(reviewId);

      // Update fields
      if (data.rating !== undefined) {
        review.rating = data.rating;
      }
      if (data.title !== undefined) {
        review.title = data.title;
      }
      if (data.content !== undefined) {
        review.content = data.content;
      }
      if (data.published !== undefined) {
        review.published = data.published;
      }

      const result = await reviewRepo.save(review);
      
      // Обновляем рейтинги товара
      await this.updateProductRatingMetadata(review.product_id);
      
      return result;
    });
  }

  async delete(reviewId: string): Promise<void> {
    return this.atomicPhase_(async (manager) => {
      const reviewRepo = manager.getRepository(ProductReview);
      const review = await this.retrieve(reviewId);
      const productId = review.product_id;
      
      await reviewRepo.remove(review);
      
      // Обновляем рейтинги товара
      await this.updateProductRatingMetadata(productId);
    });
  }

  async listByProduct(
    productId: string,
    config = { limit: 10, offset: 0 }
  ): Promise<[ProductReview[], number]> {
    const reviewRepo = this.manager_.getRepository(ProductReview);
    
    const [reviews, count] = await reviewRepo.findAndCount(
      {
        where: {
          product_id: productId,
          published: true,
        },
        order: {
          created_at: "DESC",
        },
        skip: config.offset,
        take: config.limit,
      }
    );

    return [reviews, count];
  }

  async listByCustomer(
    customerId: string,
    config = { limit: 10, offset: 0 }
  ): Promise<[ProductReview[], number]> {
    const reviewRepo = this.manager_.getRepository(ProductReview);
    
    const [reviews, count] = await reviewRepo.findAndCount(
      {
        where: {
          customer_id: customerId,
        },
        order: {
          created_at: "DESC",
        },
        skip: config.offset,
        take: config.limit,
      }
    );

    return [reviews, count];
  }

  // Вспомогательный метод для обновления метаданных рейтинга продукта
  private async updateProductRatingMetadata(productId: string): Promise<void> {
    const reviewRepo = this.manager_.getRepository(ProductReview);
    
    // Получаем средний рейтинг
    const ratingResult = await reviewRepo.createQueryBuilder("pr")
      .select("AVG(pr.rating)", "average")
      .addSelect("COUNT(pr.id)", "count")
      .where("pr.product_id = :productId", { productId })
      .andWhere("pr.published = :published", { published: true })
      .getRawOne();
    
    // Получаем процент положительных отзывов (4-5 звезд)
    const positiveCount = await reviewRepo.count({
      where: {
        product_id: productId,
        published: true,
        rating: { $gte: 4 },
      },
    });
    
    const totalCount = parseInt(ratingResult?.count || "0");
    const averageRating = parseFloat(ratingResult?.average || "0");
    const positivePercentage = totalCount > 0 
      ? Math.round((positiveCount / totalCount) * 100) 
      : 0;
    
    // Обновляем метаданные продукта
    await this.productService_.update(productId, {
      metadata: {
        average_rating: averageRating,
        total_reviews: totalCount,
        positive_percentage: positivePercentage,
      },
    });
  }
} 