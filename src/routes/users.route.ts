import express from 'express'
import { USER_MESSAGE } from '~/constants/message'
import { loginController, registerController } from '~/controllers/users.controller'
import { accessTokenValidator, loginValidator, registerValidator } from '~/middleware/users.middlewares'
import { wrapAsync } from '~/utils/handles'
const router = express.Router()

router.get('/tweets', (req, res) => {
  res.json({ data: [{ id: 1, name: 'Hoàng Anh Tuấn' }] })
})

router.post('/login', loginValidator, wrapAsync(loginController))

// Description register a new user
router.post('/register', registerValidator, registerController, wrapAsync(registerController))

router.post(
  '/logout',
  accessTokenValidator,
  wrapAsync((req, res) => {
    res.json({
      message: USER_MESSAGE.LOGOUT_SUCCESS
    })
  })
)

export default router
