import { Request, Response } from "express";

export async function listBrands(req: Request, res: Response) {
  const brandService = req.scope.resolve("brandService");
  
  const { limit, offset } = req.query;
  
  const [brands, count] = await brandService.list(
    {},
    {
      skip: offset ? parseInt(offset as string) : 0,
      take: limit ? parseInt(limit as string) : 10,
    }
  );
  
  return res.json({
    brands,
    count,
    offset: offset ? parseInt(offset as string) : 0,
    limit: limit ? parseInt(limit as string) : 10,
  });
}

export async function getBrand(req: Request, res: Response) {
  const { id } = req.params;
  const brandService = req.scope.resolve("brandService");
  
  try {
    const brand = await brandService.retrieve(id);
    return res.json({ brand });
  } catch (error) {
    return res.status(404).json({
      message: `Бренд с id: ${id} не найден`,
    });
  }
}

export async function createBrand(req: Request, res: Response) {
  const { name, description, logo_url, website } = req.body;
  const brandService = req.scope.resolve("brandService");
  
  if (!name) {
    return res.status(400).json({
      message: "Название бренда обязательно",
    });
  }
  
  try {
    const brand = await brandService.create({
      name,
      description,
      logo_url,
      website,
    });
    
    return res.status(201).json({ brand });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

export async function updateBrand(req: Request, res: Response) {
  const { id } = req.params;
  const { name, description, logo_url, website } = req.body;
  const brandService = req.scope.resolve("brandService");
  
  try {
    const brand = await brandService.update(id, {
      name,
      description,
      logo_url,
      website,
    });
    
    return res.json({ brand });
  } catch (error) {
    return res.status(error.status || 400).json({
      message: error.message,
    });
  }
}

export async function deleteBrand(req: Request, res: Response) {
  const { id } = req.params;
  const brandService = req.scope.resolve("brandService");
  
  try {
    await brandService.delete(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(error.status || 400).json({
      message: error.message,
    });
  }
} 