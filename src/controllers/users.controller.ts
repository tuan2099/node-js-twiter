import { Request, Response, NextFunction } from 'express'

export const loginController = (req: Request, res: Response) => {
  res.json({
    message: 'Login success'
  })
}
