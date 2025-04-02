import { Router } from "express";
import { wrapHandler } from "@medusajs/medusa";
import getRelated from "./get-related";

export default (storeRouter) => {
  const router = Router();
  storeRouter.use("/products", router);
  
  // Маршрут для связанных продуктов
  router.get("/:id/related", wrapHandler(getRelated));
  
  return router;
}; 