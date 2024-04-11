import User from '~/models/schemas/User.schema'
import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import userService from '~/services/users.services'
import { ObjectId } from 'mongodb'
import { USER_MESSAGE } from '~/constants/message'
import { TokenPayLoad } from '~/models/Users/User.request'

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

export const logoutController = async (req: Request, res: Response) => {
  const { refreshToken } = req.body // lấy refresh token từ body
  const result = userService.logout(refreshToken)
  return res.json({
    message: USER_MESSAGE.LOGOUT_SUCCESS,
    result
  })
}

// export const refreshTokenController = async (req: Request, res: Response) => {
//   const { user_id } = req.decoded_refresh_token as TokenPayLoad
//   const result = await userService.refreshToken(user_id)
// }
