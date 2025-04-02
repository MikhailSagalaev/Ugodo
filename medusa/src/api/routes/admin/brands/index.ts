import { Router } from "express";
import { wrapHandler } from "@medusajs/medusa";
import { 
  listBrands, 
  getBrand, 
  createBrand, 
  updateBrand, 
  deleteBrand 
} from "./handlers";

const router = Router();

export default (adminRouter) => {
  const brandRouter = Router();
  adminRouter.use("/brands", brandRouter);

  // Получение списка брендов
  brandRouter.get("/", wrapHandler(listBrands));
  
  // Получение информации о бренде
  brandRouter.get("/:id", wrapHandler(getBrand));
  
  // Создание бренда
  brandRouter.post("/", wrapHandler(createBrand));
  
  // Обновление бренда
  brandRouter.put("/:id", wrapHandler(updateBrand));
  
  // Удаление бренда
  brandRouter.delete("/:id", wrapHandler(deleteBrand));

  return brandRouter;
}; 