import { Request, Response } from "express"
import { MedusaError } from "@medusajs/utils"
import BannerService from "../../../../modules/banners/services/banner"

export async function listBanners(req: Request, res: Response): Promise<void> {
  const bannerService: BannerService = req.scope.resolve("bannerService")
  
  const [banners, count] = await bannerService.list()
  
  res.json({ banners, count })
}

export async function getBanner(req: Request, res: Response): Promise<void> {
  const bannerService: BannerService = req.scope.resolve("bannerService")
  
  const banner = await bannerService.retrieve(req.params.id)
  
  res.json({ banner })
}

export async function createBanner(req: Request, res: Response): Promise<void> {
  const bannerService: BannerService = req.scope.resolve("bannerService")
  
  const banner = await bannerService.create(req.body)
  
  res.status(201).json({ banner })
}

export async function updateBanner(req: Request, res: Response): Promise<void> {
  const bannerService: BannerService = req.scope.resolve("bannerService")
  
  const banner = await bannerService.update(req.params.id, req.body)
  
  res.json({ banner })
}

export async function deleteBanner(req: Request, res: Response): Promise<void> {
  const bannerService: BannerService = req.scope.resolve("bannerService")
  
  await bannerService.delete(req.params.id)
  
  res.status(204).send()
} 