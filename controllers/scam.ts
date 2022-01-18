import { Request, Response } from "express"
import { query, insert } from "../db";
import { getScore as getScoreAPI } from "../scamadviser";

export const getScore = async (req: Request, res: Response) => {
  const { domain, from = null, to = null } = req.query
  const response = await getScoreAPI(domain)

  await insert([domain, from, to, response.data.score])

  res.status(200).json({ success: true })
}