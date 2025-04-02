import { Request, Response } from "express"
import { MedusaError } from "@medusajs/utils"
import StoryService from "../../../../modules/stories/services/story"

export async function listStories(req: Request, res: Response): Promise<void> {
  const storyService: StoryService = req.scope.resolve("storyService")
  
  const [stories, count] = await storyService.list()
  
  res.json({ stories, count })
}

export async function getStory(req: Request, res: Response): Promise<void> {
  const storyService: StoryService = req.scope.resolve("storyService")
  
  const story = await storyService.retrieve(req.params.id)
  
  res.json({ story })
}

export async function createStory(req: Request, res: Response): Promise<void> {
  const storyService: StoryService = req.scope.resolve("storyService")
  
  const story = await storyService.create(req.body)
  
  res.status(201).json({ story })
}

export async function updateStory(req: Request, res: Response): Promise<void> {
  const storyService: StoryService = req.scope.resolve("storyService")
  
  const story = await storyService.update(req.params.id, req.body)
  
  res.json({ story })
}

export async function deleteStory(req: Request, res: Response): Promise<void> {
  const storyService: StoryService = req.scope.resolve("storyService")
  
  await storyService.delete(req.params.id)
  
  res.status(204).send()
}

export async function addSlides(req: Request, res: Response): Promise<void> {
  const storyService: StoryService = req.scope.resolve("storyService")
  
  const slides = await storyService.addSlides(req.params.id, req.body.slides)
  
  res.status(201).json({ slides })
}

export async function updateSlide(req: Request, res: Response): Promise<void> {
  const storyService: StoryService = req.scope.resolve("storyService")
  
  const slide = await storyService.updateSlide(req.params.id, req.params.slideId, req.body)
  
  res.json({ slide })
}

export async function deleteSlide(req: Request, res: Response): Promise<void> {
  const storyService: StoryService = req.scope.resolve("storyService")
  
  await storyService.deleteSlide(req.params.id, req.params.slideId)
  
  res.status(204).send()
} 