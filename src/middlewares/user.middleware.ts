import express from 'express'

export const loginValidator = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { email, password } = req.body
  if(!email || !password || !password.length) {
    return res.status(401).json({
      error: 'Missing email or password'
    })
  }
  next()
}