import { MikroOrmModule } from "@medusajs/medusa/dist/loaders/mikro-orm";
import { ProductReview } from "./reviews/entities/product-review";
import { Brand } from "./brands/entities/brand";
import { ProductRelation } from "./product-relations/entities/product-relation";
import ProductReviewService from "./reviews/services/product-review";
import BrandService from "./brands/services/brand";
import ProductRelationService from "./product-relations/services/product-relation";

export const registerModules = () => {
  // Регистрация сущностей
  MikroOrmModule.registerEntities([ProductReview, Brand, ProductRelation]);

  // Регистрация сервисов
  const moduleServices = {
    productReviewService: ProductReviewService,
    brandService: BrandService,
    productRelationService: ProductRelationService,
  };
  
  return moduleServices;
};

export default registerModules; 