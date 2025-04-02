import { NextFunction, Request, Response } from "express";

export function validateReviewPayload(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { rating, title, content } = req.body;

  if (rating === undefined || rating === null) {
    return res
      .status(400)
      .json({ message: "Необходимо указать рейтинг (1-5)" });
  }

  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return res
      .status(400)
      .json({ message: "Рейтинг должен быть числом от 1 до 5" });
  }

  // Если текст отзыва превышает лимит
  if (content && content.length > 3000) {
    return res
      .status(400)
      .json({ message: "Содержание отзыва не должно превышать 3000 символов" });
  }

  // Если заголовок превышает лимит
  if (title && title.length > 255) {
    return res
      .status(400)
      .json({ message: "Заголовок отзыва не должен превышать 255 символов" });
  }

  next();
} 