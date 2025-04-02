import { Router } from "express"
import banners from "./banners"
import stories from "./stories"

const router = Router()

router.use("/banners", banners)
router.use("/stories", stories)

export default router 