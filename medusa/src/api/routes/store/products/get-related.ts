import { Request, Response } from "express";
import { RelationType } from "../../../../modules/product-relations/entities/product-relation";

/**
 * @schema GetProductRelationsParams
 * type: object
 * required:
 *   - id
 * properties:
 *   id:
 *     type: string
 *     description: ID продукта
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params;
  const { type, limit, offset } = req.query;

  const productRelationService = req.scope.resolve("productRelationService");
  const productService = req.scope.resolve("productService");

  try {
    const relationType = type as string;
    
    // Получаем связи
    const { relations, count } = await productRelationService.findRelatedProducts(
      id,
      relationType ? (relationType as RelationType) : undefined,
      {
        take: limit ? parseInt(limit as string) : 10,
        skip: offset ? parseInt(offset as string) : 0,
      }
    );

    // Если нет связей, возвращаем пустой массив
    if (!relations.length) {
      return res.json({
        related_products: [],
        count: 0,
      });
    }

    // Получаем ID связанных продуктов
    const relatedProductIds = relations.map((relation) => relation.to_product_id);

    // Загружаем данные связанных продуктов
    const relatedProducts = await productService.list(
      { id: relatedProductIds },
      { 
        relations: ["variants", "variants.prices", "images", "options", "tags"],
        take: relatedProductIds.length,
      }
    );

    // Сортируем продукты в том же порядке, что и связи
    const sortedProducts = relatedProductIds.map((id) => 
      relatedProducts.find((product) => product.id === id)
    ).filter(Boolean);

    return res.json({
      related_products: sortedProducts,
      count,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}; 