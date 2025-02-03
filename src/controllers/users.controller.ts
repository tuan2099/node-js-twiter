import express from 'express'

export const loginController = (req: express.Request, res: express.Response) => {
  res.json({
    message: 'Login successfully'
  })
}
