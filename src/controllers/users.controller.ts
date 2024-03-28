import User from '~/models/schemas/User.schema'
import { Request, Response } from 'express'
import databaseService from '~/services/database.services'

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

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await databaseService.users.insertOne(
      new User({
        email,
        password
      })
    )
    return res.json({
      message: 'register success'
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      error: 'register failded'
    })
  }
}
