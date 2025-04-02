import { EntityManager } from "@mikro-orm/core";
import { ProductFlag, ProductFlagType } from "../entities/product-flag";
import { ProductFlagRepository } from "../repositories/product-flag.repository";
import { MedusaError } from "@medusajs/utils";

type CreateFlagInput = {
  product_id: string;
  type: ProductFlagType;
  metadata?: Record<string, unknown>;
  is_active?: boolean;
  valid_until?: Date;
};

type UpdateFlagInput = Omit<Partial<CreateFlagInput>, 'product_id' | 'type'>;

export default class ProductFlagService {
  protected readonly manager_: EntityManager;
  protected readonly productService_: any;

  constructor({ manager, productService }) {
    this.manager_ = manager;
    this.productService_ = productService;
  }

  /**
   * Создает новый маркер товара.
   */
  async create(data: CreateFlagInput): Promise<ProductFlag> {
    // Проверяем существование товара
    await this.productService_.retrieve(data.product_id);

    // Проверяем, что у товара еще нет маркера этого типа
    const existingFlag = await ProductFlagRepository.findByProductAndType(
      this.manager_,
      data.product_id,
      data.type
    );

    if (existingFlag) {
      // Если маркер уже существует, обновляем его
      return this.update(existingFlag.id, {
        metadata: data.metadata,
        is_active: data.is_active ?? true,
        valid_until: data.valid_until,
      });
    }

    // Создаем новый маркер
    const flag = new ProductFlag({
      ...data,
      is_active: data.is_active ?? true,
    });

    const repository = this.manager_.getRepository(ProductFlag);
    await repository.create(flag);
    return flag;
  }

  /**
   * Получает маркер товара по ID.
   */
  async retrieve(flagId: string): Promise<ProductFlag> {
    const flag = await ProductFlagRepository.findById(this.manager_, flagId);

    if (!flag) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product flag with id ${flagId} not found`
      );
    }

    return flag;
  }

  /**
   * Обновляет маркер товара.
   */
  async update(flagId: string, data: UpdateFlagInput): Promise<ProductFlag> {
    const flag = await this.retrieve(flagId);

    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        flag[key] = data[key];
      }
    });

    const repository = this.manager_.getRepository(ProductFlag);
    await repository.save(flag);
    return flag;
  }

  /**
   * Удаляет маркер товара.
   */
  async delete(flagId: string): Promise<void> {
    const flag = await this.retrieve(flagId);

    const repository = this.manager_.getRepository(ProductFlag);
    await repository.delete(flag);
  }

  /**
   * Удаляет все маркеры товара определенного типа или все маркеры товара.
   */
  async removeProductFlags(productId: string, type?: ProductFlagType): Promise<void> {
    // Проверяем существование товара
    await this.productService_.retrieve(productId);

    // Удаляем маркеры
    await ProductFlagRepository.removeProductFlags(this.manager_, productId, type);
  }

  /**
   * Получает товары по типу маркера.
   */
  async getProductsByFlagType(
    type: ProductFlagType,
    options: { limit?: number; offset?: number } = {}
  ): Promise<string[]> {
    return ProductFlagRepository.findProductIdsByType(this.manager_, type, options);
  }

  /**
   * Проверяет, имеет ли товар маркер определенного типа.
   */
  async hasFlag(productId: string, type: ProductFlagType): Promise<boolean> {
    const flag = await ProductFlagRepository.findByProductAndType(
      this.manager_,
      productId,
      type
    );

    return !!flag;
  }

  /**
   * Получает маркеры товара по типу.
   */
  async getFlagsByType(
    type: ProductFlagType,
    options: { limit?: number; offset?: number } = {}
  ): Promise<[ProductFlag[], number]> {
    return ProductFlagRepository.findByType(this.manager_, type, options);
  }
} 