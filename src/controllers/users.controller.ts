import User from '~/models/schemas/User.schema'
import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import userService from '~/services/users.services'
import { ObjectId } from 'mongodb'
import { USER_MESSAGE } from '~/constants/message'
import { TokenPayLoad } from '~/models/Users/User.request'
import databaseService from '~/services/database.services'
import httpStatus from '~/constants/httpStatus'

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

export const verifyEmailController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayLoad;
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id),

  })
  // nếu ko tìm thấy user
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: USER_MESSAGE.USER_NOT_FOUND
    })
  }
  // đã verify rồi thì ko báo lỗi nữa 
  if (user.email_verify_token === '') {
    return res.json({
      message: USER_MESSAGE.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }

  const result = await userService.verifyEmail(user_id)
  return res.json({
    message: USER_MESSAGE.EMAIL_VERIFY_SUCCESS,
    result
  })
}