import express from 'express'
import {
  forgotPasswordController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  updateMeController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controller'
import { filterMiddleware } from '~/middleware/common.middleware'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middleware/users.middlewares'
import { wrapAsync } from '~/utils/handles'
const router = express.Router()

// Description login user
router.post('/login', loginValidator, wrapAsync(loginController))

/**
 * Description. Register a new user
 * Path: /register
 * Method: POST
 * Body: { name: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601 }
 */
router.post('/register', registerValidator, registerController, wrapAsync(registerController))

/**
 * Description. Logout a user
 * Path: /logout
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { refresh_token: string }
 */
router.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

/**
 * Description. Verify email when user client click on the link in email
 * Path: /verify-email
 * Method: POST
 * Body: { email_verify_token: string }
 */
router.post('/verify-email', emailVerifyTokenValidator, wrapAsync(verifyEmailController))

/**
 * Description. Verify email when user client click on the link in email
 * Path: /resend-verify-email
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {}
 */
router.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendVerifyEmailController))

/**
 * Description. Submit email to reset password, send email to user
 * Path: /forgot-password
 * Method: POST
 * Body: {email: string}
 */
router.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

/**
 * Description. Verify link in email to reset password
 * Path: /verify-forgot-password
 * Method: POST
 * Body: {forgot_password_token: string}
 */
router.post('/verify-forgot-password', verifyForgotPasswordTokenValidator, wrapAsync(verifyForgotPasswordController))

/**
 * Description: Reset password
 * Path: /reset-password
 * Method: POST
 * Body: {forgot_password_token: string, password: string, confirm_password: string}
 */
router.post('/reset-password', resetPasswordValidator, wrapAsync(resetPasswordController))

/**
 * Description: Get my profile
 * Path: /me
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
router.get('/me', accessTokenValidator, wrapAsync(getMeController))

/**
 * Description: Update my profile
 * Path: /me
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: UserSchema
 */
router.get(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware(['name', 'date_of_birth', 'bio', 'location', 'website', 'username', 'avatar', 'cover_photo']),
  wrapAsync(updateMeController)
)

/**
 * Description: Get user profile
 * Path: /:username
 * Method: GET
 */
router.get('/:username', wrapAsync(getProfileController))

// router.post('/refresh-token', refreshTokenValidator,wrapAsync(refreshTokenController)
export default router
