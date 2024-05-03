import User from '~/models/schemas/User.schema'
import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import userService from '~/services/users.services'
import { ObjectId } from 'mongodb'
import { USER_MESSAGE } from '~/constants/message'
import { ForgotPassReqBody, TokenPayLoad } from '~/models/Users/User.request'
import databaseService from '~/services/database.services'
import httpStatus from '~/constants/httpStatus'
import { UserVerifyStatus } from '~/constants/enums'

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User // láy bên middleware
  const user_id = user._id as ObjectId
  const result = await userService.login({ user_id: user_id.toString(), verify: user.verify })
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
  const { user_id } = req.decoded_email_verify_token as TokenPayLoad
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
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

export const resendVerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authourization as TokenPayLoad
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: USER_MESSAGE.USER_NOT_FOUND
    })
  }

  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      mesage: USER_MESSAGE.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }

  const result = await userService.resendVerifyEmail(user_id)
  return res.json(result)
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPassReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id, verify } = req.body as User
  const result = await userService.forgotPass({ user_id: (_id as ObjectId).toString(), verify })
  return res.json({
    result
  })
}

export const verifyForgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  return res.json({
    message: USER_MESSAGE.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
}

export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayLoad
  const { password } = req.body
  const result = await userService.resetPassword(user_id, password)
  return res.json(result)
}

export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authourization as TokenPayLoad
  const user = await userService.getMe(user_id)
  return res.json({
    message: USER_MESSAGE.GET_PROFILE_SUCCESS,
    result: user
  })
}

export const updateMeController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authourization as TokenPayLoad
  const { body } = req
  const user = await userService.updateMe(user_id, body)
  return res.json({
    message: USER_MESSAGE.UPDATE_ME_SUCCESS,
    result: user
  })
}

export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params
  const user = await userService.getProfile(username)
  return res.json({
    message: USER_MESSAGE.GET_PROFILE_SUCCESS,
    result: user
  })
}

export const followUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authourization as TokenPayLoad
  const { followed_user_id } = req.body
  const result = await userService.follow(user_id, followed_user_id)
  return res.json({
    message: USER_MESSAGE.FOLLOW_SUCCESS,
    result
  })
}

export const unfollowController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authourization as TokenPayLoad
  const { user_id: followed_user_id } = req.params
  const result = await userService.unfollow(user_id, followed_user_id)
  return res.json({
    message: USER_MESSAGE.UNFOLLOW_SUCCESS,
    result
  })
}
