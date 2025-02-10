import express from 'express'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVVerifyTokenValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unfollowValidator,
  updateMeValidator,
  verifyForgotPasswordTokenValidator,
  verifyUserValidator
} from '~/middlewares/user.middleware'
import {
  changePasswordController,
  emailVerifyController,
  followController,
  forgotPasswordController,
  getProfileController,
  loginController,
  logoutController,
  meController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  unfollowController,
  updateMeController,
  verifyForgotPasswordController
} from '~/controllers/users.controller'
import { wrapRequestHandler } from '~/utils/handlers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.requests'
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
usersRouter.post(
  '/verify-forgot-password-token',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

/**
 Des: Reset Password
 path: /reset-password
 method: 'POST'
 body: {forgot_password_token : string, password: string, confirm_password: string}
 **/
usersRouter.post('/verify-forgot-password-token', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 Des: Get my profile
 path: /me
 method: 'GET'
 header: {Authorization: Bearer <access_token>}
 **/
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(meController))

/**
 Des: Get user info
 path: /me
 method: 'GET'
 header: {Authorization: Bearer <access_token>}
 **/
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(meController))

/**
 Des: Update my profile
 path: /me
 method: 'PATCH'
 header: {Authorization: Bearer <access_token>}
 body: UserSchema
 **/
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifyUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'email',
    'date_of_birth',
    'bio',
    'location',
    'username',
    'website',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)

/**
 Des: Get user profile
 path: /:username
 method: 'GET'
 **/
usersRouter.get('/:username', wrapRequestHandler(getProfileController))

/**
 Des: Follow user
 path: /follow
 method: 'POST'
 header: {Authorization: Bearer <access_token>}
 body: {followed_user_id: string}
 **/
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifyUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)

/**
 Des: UnFollow user
 path: /follow/user_id
 method: 'DELETE'
 header: {Authorization: Bearer <access_token>}
 **/
usersRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifyUserValidator,
  unfollowValidator,
  wrapRequestHandler(unfollowController)
)

/**
 Des: Change Password
 path: /change-password
 method: 'PUT'
 header: {Authorization: Bearer <access_token>}
 Body: { old_password: string, password: string, confirm_password: string }
 **/
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifyUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)
export default usersRouter
