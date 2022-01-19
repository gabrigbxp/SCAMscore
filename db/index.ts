import { Pool } from "pg"

const pool = new Pool()

export const query = (text: string, params: string[] = []) => pool.query(text, params)

export const insert = (values: string[]) => pool.query({
  text: "INSERT INTO public.score(domain, \"date\", score) VALUES ($1, $2, $3) RETURNING id",
  values
})
