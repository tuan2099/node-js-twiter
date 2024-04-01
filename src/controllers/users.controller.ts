import User from '~/models/schemas/User.schema'
import { NextFunction, Request, Response } from 'express'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  console.log(email)
  if (email === 'hoangtuan@gmail.com' && password === '123456') {
    return res.status(200).json({
      message: 'Login success'
    })
  }

  return res.status(400).json({
    error: 'Missing email or pass1345'
  })
}

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  const result = await userService.register({ email, password })
  return res.json({
    message: 'register success',
    result
  })
}
