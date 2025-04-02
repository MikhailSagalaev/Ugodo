import { Router } from "express"
import { wrapHandler } from "@medusajs/utils"
import { createStory, updateStory, deleteStory, getStory, listStories, addSlides, updateSlide, deleteSlide } from "./handlers"

const router = Router()

router.get("/", listStories)
router.get("/:id", getStory)
router.post("/", wrapHandler(createStory))
router.put("/:id", wrapHandler(updateStory))
router.delete("/:id", wrapHandler(deleteStory))

// Маршруты для слайдов
router.post("/:id/slides", wrapHandler(addSlides))
router.put("/:id/slides/:slideId", wrapHandler(updateSlide))
router.delete("/:id/slides/:slideId", wrapHandler(deleteSlide))

export default router 