import { Router } from "express";
import { getScore } from "../controllers/scam";
import { errorHandler } from "../middlewares/errorHandler.js"

const router = Router()

router.get("/", errorHandler(getScore))

export default router
