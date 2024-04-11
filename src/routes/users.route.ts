import express from 'express'
import { USER_MESSAGE } from '~/constants/message'
import { loginController, logoutController, registerController } from '~/controllers/users.controller'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middleware/users.middlewares'
import { wrapAsync } from '~/utils/handles'
const router = express.Router()

router.get('/tweets', (req, res) => {
  res.json({ data: [{ id: 1, name: 'Hoàng Anh Tuấn' }] })
})

router.post('/login', loginValidator, wrapAsync(loginController))

// Description register a new user
router.post('/register', registerValidator, registerController, wrapAsync(registerController))

router.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

// router.post('/refresh-token', refreshTokenValidator,wrapAsync(refreshTokenController)
export default router
