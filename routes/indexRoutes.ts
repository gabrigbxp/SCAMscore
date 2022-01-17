import { Router } from "express";
import { getScore } from "../scamadviser";

const router = Router()

router.get("/", async (_req, res) => {
  console.debug(await getScore())
  res.send("hello darkness")
})

export default router
