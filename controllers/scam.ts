import { Request, Response } from "express"
import { query, insert } from "../db";
import { getScore as getScoreAPI } from "../scamadviser";

export const getScore = async (req: Request, res: Response) => {
  const { domain, from, to } = req.query
  const response = await getScoreAPI(domain)
  const now = new Date()

  const { rows: inserted } = await insert([domain, now, response.data.score])

  let where: string | undefined
  let history: Array<object> | undefined

  if (from && to) {
    where = `where date between '${from}' and '${to}'`
  } else if (from) {
    where = `where date >= '${from}'`
  } else if (to) {
    where = `where date <= '${to}'`
  }

  where && (where += ` and id <> ${inserted[0].id}`)

  if (where) {
    const { rows } = await query(`select "date", score from public.score ${where} order by "date" asc`)
    history = rows
  }

  res.status(200).json({ score: response.data.score, history })
}