import { Router } from "express";
import { wrapHandler } from "@medusajs/medusa";
import { 
  getProductReviews, 
  createProductReview,
  getCustomerReviews
} from "./handlers";
import { validateReviewPayload } from "./middlewares";

const router = Router();

export default (storeRouter) => {
  const reviewRouter = Router();
  storeRouter.use("/reviews", reviewRouter);

  // Получение отзывов для продукта
  reviewRouter.get("/product/:id", wrapHandler(getProductReviews));
  
  // Получение отзывов пользователя
  reviewRouter.get("/customer", wrapHandler(getCustomerReviews));
  
  // Создание отзыва
  reviewRouter.post("/product/:id", validateReviewPayload, wrapHandler(createProductReview));

  return reviewRouter;
}; 