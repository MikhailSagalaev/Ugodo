import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  const { id, relation_id } = req.params;

  const productRelationService = req.scope.resolve("productRelationService");

  try {
    await productRelationService.delete(relation_id);
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}; 