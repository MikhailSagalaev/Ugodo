import { Router } from "express"
import { wrapHandler } from "@medusajs/utils"
import { createBanner, updateBanner, deleteBanner, getBanner, listBanners } from "./handlers"

const router = Router()

router.get("/", listBanners)
router.get("/:id", getBanner)
router.post("/", wrapHandler(createBanner))
router.put("/:id", wrapHandler(updateBanner))
router.delete("/:id", wrapHandler(deleteBanner))

export default router 