import express from 'express'
import userService from '~/services/user.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGES } from '~/constants/messages'
import { LocgoutReqBody, RegisterReqBody } from '~/models/requests/User.requests'

export const loginController = async (req: express.Request, res: express.Response) => {
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
  req: express.Request<ParamsDictionary, any, LocgoutReqBody>,
  res: express.Response
) => {
  const { refresh_token } = req.body
  const result = userService.logout(refresh_token)
  return res.json(result)
}
