import express from 'express'
import {
  accessTokenValidator, emailVVerifyTokenValidator, forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator, verifyForgotPasswordTokenValidator
} from '~/middlewares/user.middleware'
import {
  emailVerifyController,
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController, verifyForgotPasswordController
} from '~/controllers/users.controller'
import { wrapRequestHandler } from '~/utils/handlers'
const usersRouter = express.Router()

/**
 Des: Login acc
 path: login
 method: 'POST'
 body : {email: string , password: string}
 **/
usersRouter.post('/login', loginValidator, loginController)

/**
Des: Register new user
path: register
method: 'POST'
body : {name: string, email: string , password: string, date_of_birth: ISO8601, confirm_password: string}
**/
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 Des: Logout
 path: Logout
 method: 'POST'
 header: {Authorization : Bearer <access token>}
 body: {refresh_token: string}
 **/
usersRouter.post('/logout', refreshTokenValidator, accessTokenValidator, wrapRequestHandler(logoutController))

/**
 Des: Verify email when user click on link in email
 path: /verify-email
 method: 'POST'
 body: {email_verify_token: string}
 **/
usersRouter.post('/verify-email', emailVVerifyTokenValidator, wrapRequestHandler(emailVerifyController))

/**
 Des: Verify email when user click on link in email
 path: /verify-email
 method: 'POST'
 header: {Authorization : Bearer <access token>}
 **/
usersRouter.post(
  '/resend-verify-email',
  accessTokenValidator,
  emailVVerifyTokenValidator,
  wrapRequestHandler(resendVerifyEmailController)
)

/**
 Des: Submit email to reset password
 path: /forgot-password
 method: 'POST'
 body: {email : string}
 **/
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 Des: Submit email to reset password
 path: /verify-forgot-password-token
 method: 'POST'
 body: {forgot_password_token : string}
 **/
usersRouter.post('/verify-forgot-password-token', verifyForgotPasswordTokenValidator, wrapRequestHandler(verifyForgotPasswordController))

export default usersRouter
