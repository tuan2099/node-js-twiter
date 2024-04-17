import express from 'express'
import {
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  verifyEmailController
} from '~/controllers/users.controller'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
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

router.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendVerifyEmailController))

// router.post('/refresh-token', refreshTokenValidator,wrapAsync(refreshTokenController)
export default router
