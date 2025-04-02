import { EntitySchema } from '@mikro-orm/core';
import { ProductReview } from "./reviews/entities/product-review";
import { Brand } from "./brands/entities/brand";
import { ProductRelation } from "./product-relations/entities/product-relation";
import { Banner } from "./banners/entities/banner";
import { Story } from "./stories/entities/story";
import { StorySlide } from "./stories/entities/story-slide";
import { ProductFlag } from "./product-flags/entities/product-flag";
import { RecentlyViewed } from "./recently-viewed/entities/recently-viewed";

import ProductReviewService from "./reviews/services/product-review";
import BrandService from "./brands/services/brand";
import ProductRelationService from "./product-relations/services/product-relation";
import BannerService from "./banners/services/banner";
import StoryService from "./stories/services/story";
import ProductFlagService from "./product-flags/services/product-flag";
import RecentlyViewedService from "./recently-viewed/services/recently-viewed";

// Замена для MikroOrmModule
export const ModuleLoader = {
  registerEntities: (entities: any[]) => {
    // В Medusa будет подхвачено через связи зависимостей
    return entities;
  }
}

export const registerModules = () => {
  // Регистрация сущностей
  ModuleLoader.registerEntities([
    ProductReview, 
    Brand, 
    ProductRelation,
    Banner,
    Story,
    StorySlide,
    ProductFlag,
    RecentlyViewed
  ]);

  // Регистрация сервисов
  const moduleServices = {
    productReviewService: ProductReviewService,
    brandService: BrandService,
    productRelationService: ProductRelationService,
    bannerService: BannerService,
    storyService: StoryService,
    productFlagService: ProductFlagService,
    recentlyViewedService: RecentlyViewedService
  };
  
  return moduleServices;
};

export default registerModules; 