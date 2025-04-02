import { Request, Response } from "express";

/**
 * @schema GetProductReviewsParams
 * type: object
 * required:
 *   - id
 * properties:
 *   id:
 *     type: string
 *     description: ID продукта
 */
export async function getProductReviews(req: Request, res: Response) {
  const { id } = req.params;
  const { limit, offset } = req.query;

  const productReviewService = req.scope.resolve("productReviewService");

  const [reviews, count] = await productReviewService.listByProduct(
    id,
    {
      limit: limit ? parseInt(limit as string) : 10,
      offset: offset ? parseInt(offset as string) : 0,
    }
  );

  return res.json({
    reviews,
    count,
    offset: offset ? parseInt(offset as string) : 0,
    limit: limit ? parseInt(limit as string) : 10,
  });
}

/**
 * @schema GetCustomerReviewsParams
 * type: object
 * required:
 *   - id
 * properties:
 *   id:
 *     type: string
 *     description: ID клиента
 */
export async function getCustomerReviews(req: Request, res: Response) {
  const customerId = req.user?.customer_id;

  if (!customerId) {
    return res.status(401).json({
      message: "Необходимо авторизоваться для просмотра своих отзывов",
    });
  }

  const { limit, offset } = req.query;
  const productReviewService = req.scope.resolve("productReviewService");

  const [reviews, count] = await productReviewService.listByCustomer(
    customerId,
    {
      limit: limit ? parseInt(limit as string) : 10,
      offset: offset ? parseInt(offset as string) : 0,
    }
  );

  return res.json({
    reviews,
    count,
    offset: offset ? parseInt(offset as string) : 0,
    limit: limit ? parseInt(limit as string) : 10,
  });
}

/**
 * @schema CreateProductReviewBody
 * type: object
 * required:
 *   - rating
 * properties:
 *   rating:
 *     type: number
 *     description: Рейтинг продукта от 1 до 5
 *     minimum: 1
 *     maximum: 5
 *   title:
 *     type: string
 *     description: Заголовок отзыва
 *   content:
 *     type: string
 *     description: Содержание отзыва
 */
export async function createProductReview(req: Request, res: Response) {
  const { id } = req.params;
  const { rating, title, content } = req.body;
  const customerId = req.user?.customer_id;

  const productReviewService = req.scope.resolve("productReviewService");

  try {
    const review = await productReviewService.create({
      product_id: id,
      customer_id: customerId || undefined,
      rating,
      title,
      content,
    });

    return res.status(201).json({ review });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
} 