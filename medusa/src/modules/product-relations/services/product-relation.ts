import { TransactionBaseService } from "@medusajs/utils/dist/common";
import { EntityManager } from "@mikro-orm/core";
import { ProductRelation, RelationType } from "../entities/product-relation";
import { ProductRelationRepository } from "../repositories/product-relation.repository";
import { ProductService } from "@medusajs/medusa";
import { MedusaError } from "medusa-core-utils";

type CreateRelationInput = {
  from_product_id: string;
  to_product_id: string;
  type: RelationType;
  position?: number;
  is_active?: boolean;
};

type UpdateRelationInput = {
  position?: number;
  is_active?: boolean;
};

export default class ProductRelationService extends TransactionBaseService {
  protected readonly manager_: EntityManager;
  protected readonly productService_: ProductService;

  constructor({ manager, productService }) {
    super(arguments[0]);
    this.manager_ = manager;
    this.productService_ = productService;
  }

  /**
   * Создает связь между продуктами.
   */
  async create(data: CreateRelationInput): Promise<ProductRelation> {
    return this.atomicPhase_(async (manager) => {
      // Проверяем существование продуктов
      await this.validateProducts(data.from_product_id, data.to_product_id);
      
      // Проверяем, не существует ли уже такая связь
      const existingRelation = await ProductRelationRepository.findRelation(
        manager,
        data.from_product_id,
        data.to_product_id,
        data.type
      );
      
      if (existingRelation) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          `Relation between products ${data.from_product_id} and ${data.to_product_id} with type ${data.type} already exists`
        );
      }
      
      // Если позиция не указана, ставим в конец
      if (data.position === undefined) {
        const relationsCount = await ProductRelationRepository.countRelations(
          manager,
          data.from_product_id,
          data.type
        );
        data.position = relationsCount;
      }
      
      // Создаем связь
      const relation = new ProductRelation({
        ...data,
        is_active: data.is_active ?? true,
      });
      
      await manager.getRepository(ProductRelation).persistAndFlush(relation);
      
      return relation;
    });
  }

  /**
   * Получает связь по ID.
   */
  async retrieve(relationId: string): Promise<ProductRelation> {
    const relation = await this.manager_.getRepository(ProductRelation).findOne(relationId);
    
    if (!relation) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product relation with id ${relationId} not found`
      );
    }
    
    return relation;
  }

  /**
   * Обновляет связь.
   */
  async update(relationId: string, data: UpdateRelationInput): Promise<ProductRelation> {
    return this.atomicPhase_(async (manager) => {
      const relation = await this.retrieve(relationId);
      
      if (data.position !== undefined) {
        relation.position = data.position;
      }
      
      if (data.is_active !== undefined) {
        relation.is_active = data.is_active;
      }
      
      await manager.getRepository(ProductRelation).persistAndFlush(relation);
      
      return relation;
    });
  }

  /**
   * Удаляет связь.
   */
  async delete(relationId: string): Promise<void> {
    return this.atomicPhase_(async (manager) => {
      const relation = await this.retrieve(relationId);
      await manager.getRepository(ProductRelation).removeAndFlush(relation);
    });
  }

  /**
   * Находит продукты, связанные с указанным продуктом.
   */
  async findRelatedProducts(
    productId: string, 
    type?: RelationType, 
    config: { take?: number; skip?: number } = {}
  ): Promise<{ relations: ProductRelation[]; count: number }> {
    const manager = this.manager_;
    
    // Проверяем существование продукта
    await this.productService_.retrieve(productId);
    
    const relations = await ProductRelationRepository.findRelatedProducts(
      manager,
      productId,
      type
    );
    
    const count = relations.length;
    
    // Применяем пагинацию, если указана
    let paginatedRelations = relations;
    if (config.skip !== undefined || config.take !== undefined) {
      const start = config.skip || 0;
      const end = config.take ? start + config.take : undefined;
      paginatedRelations = relations.slice(start, end);
    }
    
    return { relations: paginatedRelations, count };
  }

  /**
   * Находит все типы связей для продукта.
   */
  async findRelationTypes(productId: string): Promise<RelationType[]> {
    // Проверяем существование продукта
    await this.productService_.retrieve(productId);
    
    const relations = await this.manager_.getRepository(ProductRelation).find(
      { from_product_id: productId, is_active: true },
      { fields: ['type'] }
    );
    
    // Получаем уникальные типы связей
    const types = [...new Set(relations.map(r => r.type))];
    
    return types;
  }

  /**
   * Проверяет существование продуктов.
   */
  private async validateProducts(fromProductId: string, toProductId: string): Promise<void> {
    await this.productService_.retrieve(fromProductId);
    await this.productService_.retrieve(toProductId);
    
    if (fromProductId === toProductId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `A product cannot be related to itself`
      );
    }
  }
} 