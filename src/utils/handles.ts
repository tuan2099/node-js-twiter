import express, { Request, Response, NextFunction, RequestHandler } from 'express'

export const wrapAsync = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
