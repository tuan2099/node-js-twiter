import express from 'express'
import userService from '~/services/user.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGES } from '~/constants/messages'
import {
  ChangePasswordReqBody,
  FollowReqBody,
  ForgotPasswordReqBody, GetProfileReqParams,
  LoginReqBody,
  LogoutReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload, UnfollowReqParams, UpdateMeReqBody,
  VerifyEmailReqBody,
  VerifyForgotPasswordReqBody
} from '~/models/requests/User.requests'
import databaseServices from '~/services/database.services'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { UserVerifyStatus } from '~/constants/enums'
import User from '~/models/schemas/User.schema'
import { pick } from 'lodash'

export const loginController = async (
  req: express.Request<ParamsDictionary, any, LoginReqBody>,
  res: express.Response
) => {
  const { user }: any = req
  const user_id = user._id
  const result = await userService.login({ user_id: user_id.toString(), verify: user.verify })
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
  const { _id, verify } = req.user as User
  const result = await userService.forgotPassword({ user_id: (_id as ObjectId).toString(), verify })
  return res.json(result)
}

export const verifyForgotPasswordController = async (
  req: express.Request<ParamsDictionary, any, VerifyForgotPasswordReqBody>,
  res: express.Response
) => {
  return res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
}

export const resetPasswordController = async (
  req: express.Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: express.Response
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  const result = userService.resetPassword(user_id, password)
  return res.json(result)
}

export const meController = async (
  req: express.Request,
  res: express.Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await userService.getMe(user_id)
  return res.json({ message: USERS_MESSAGES.GET_ME_SUCCESS, result: user })
}

export const updateMeController = async (
  req: express.Request<ParamsDictionary, any, UpdateMeReqBody>,
  res: express.Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { body } = req
  const user = userService.updateMe(user_id, body)
  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    result: user
  })
}

export const getProfileController = async (req: express.Request<GetProfileReqParams>, res: express.Response) => {
  const { username } = req.params
  const user = await userService.getProfile(username)
  return res.json({
    message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
    result: user
  })
}
export const followController = async (
  req: express.Request<ParamsDictionary, any, FollowReqBody>,
  res: express.Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { followed_user_id } = req.body
  const result = await userService.follow(user_id, followed_user_id)
  return res.json({ result })
}

export const unfollowController = async (req: express.Request<UnfollowReqParams>, res: express.Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { user_id: follow_user_id } = req.params
  const result = await userService.unfollow(user_id, follow_user_id)
  return res.json(result)
}

export const changePasswordController = async (
  req: express.Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: express.Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { password } = req.body
  const result = await userService.changePassword(user_id, password)
  return res.json(result)
}
