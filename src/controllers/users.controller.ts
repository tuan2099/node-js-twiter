import express from 'express'
import userService from '~/services/user.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGES } from '~/constants/messages'
import {
  ForgotPasswordReqBody,
  LoginReqBody,
  LogoutReqBody,
  RegisterReqBody,
  TokenPayload,
  VerifyEmailReqBody
} from '~/models/requests/User.requests'
import databaseServices from '~/services/database.services'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { UserVerifyStatus } from '~/constants/enums'
import User from '~/models/schemas/User.schema'

export const loginController = async (
  req: express.Request<ParamsDictionary, any, LoginReqBody>,
  res: express.Response
) => {
  const { user }: any = req
  const user_id = user._id
  const result = await userService.login(user_id.toString())
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (
  req: express.Request<ParamsDictionary, any, RegisterReqBody>,
  res: express.Response,
  next: express.NextFunction
) => {
  const result = await userService.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const logoutController = async (
  req: express.Request<ParamsDictionary, any, LogoutReqBody>,
  res: express.Response
) => {
  const { refresh_token } = req.body
  const result = userService.logout(refresh_token)
  return res.json(result)
}

export const emailVerifyController = async (req: express.Request, res: express.Response) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseServices.users.findOne({
    _id: new ObjectId(req.params.user_id)
  })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  if (user.email_verify_token === '') {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = await userService.verifyEmail(user_id)
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const resendVerifyEmailController = async (
  req: express.Request<ParamsDictionary, any, VerifyEmailReqBody>,
  res: express.Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = await userService.resendVerifyEmail(user_id)
  return res.json({ result })
}

export const forgotPasswordController = async (
  req: express.Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: express.Response
) => {
  const { _id } = req.user as User
  const result = await userService.forgotPassword((_id as ObjectId).toString())
  return res.json(result)
}

export const verifyForgotPasswordController = async (
  req: express.Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: express.Response
) => {
  return res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
}
