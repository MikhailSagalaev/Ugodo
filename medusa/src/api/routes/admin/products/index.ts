import { Router } from "express";
import { wrapHandler } from "@medusajs/medusa";
import addRelation from "./add-relation";
import deleteRelation from "./delete-relation";
import getRelations from "./get-relations";

export default (adminRouter) => {
  const router = Router();
  adminRouter.use("/products", router);
  
  // Маршруты для связанных продуктов
  router.get("/:id/relations", wrapHandler(getRelations));
  router.post("/:id/relations", wrapHandler(addRelation));
  router.delete("/:id/relations/:relation_id", wrapHandler(deleteRelation));
  
  return router;
}; 