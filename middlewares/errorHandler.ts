import { Request, Response, NextFunction } from "express"

export const errorHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  fn(req, res, next)
    .catch((error: any) => next(error))

export const errorUse = (err: any, _req: Request, res: Response, _next: NextFunction) =>
  res.status(err.code && err.code < 600 ? err.code : 500)
    .json({
      status: 'error',
      message: err.message,
    })
