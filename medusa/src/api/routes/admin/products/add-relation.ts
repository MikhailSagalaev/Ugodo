import { Request, Response } from "express";
import { RelationType } from "../../../../modules/product-relations/entities/product-relation";

/**
 * @schema AdminAddProductRelationReq
 * type: object
 * required:
 *   - to_product_id
 *   - type
 * properties:
 *   to_product_id:
 *     type: string
 *     description: ID продукта, с которым устанавливается связь
 *   type:
 *     type: string
 *     description: Тип связи
 *     enum: [similar, accessory, bought_together, complement, substitute, upsell, cross_sell]
 *   position:
 *     type: number
 *     description: Позиция в списке связанных товаров
 *   is_active:
 *     type: boolean
 *     description: Активна ли связь
 *     default: true
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params;
  const { to_product_id, type, position, is_active } = req.body;

  if (!to_product_id) {
    return res.status(400).json({
      message: "to_product_id is required",
    });
  }

  if (!type || !Object.values(RelationType).includes(type as RelationType)) {
    return res.status(400).json({
      message: `type must be one of ${Object.values(RelationType).join(", ")}`,
    });
  }

  const productRelationService = req.scope.resolve("productRelationService");

  try {
    const relation = await productRelationService.create({
      from_product_id: id,
      to_product_id,
      type: type as RelationType,
      position: position !== undefined ? Number(position) : undefined,
      is_active: is_active !== undefined ? Boolean(is_active) : undefined,
    });

    return res.status(201).json({ relation });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}; 