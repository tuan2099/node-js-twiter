import User from '~/models/schemas/User.schema'
import { NextFunction, Request, Response } from 'express'
import databaseService from '~/services/database.services'
import { ParamsDictionary } from 'express-serve-static-core'
import userService from '~/services/users.services'
import { ObjectId } from 'mongodb'
import { USER_MESSAGE } from '~/constants/message'

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User // láy bên middleware
  const user_id = user._id as ObjectId
  const result = await userService.login(user_id.toString())
  return res.json({
    message: USER_MESSAGE.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any>, res: Response) => {
  const result = await userService.register(req.body)
  return res.json({
    message: USER_MESSAGE.REGISTER_SUCCESS,
    result
  })
}
