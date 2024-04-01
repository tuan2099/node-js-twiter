import express from 'express'
import { loginController, registerController } from '~/controllers/users.controller'
import { loginValidator, registerValidator } from '~/middleware/users.middlewares'
import { wrapAsync } from '~/utils/handles'
const router = express.Router()

router.get('/tweets', (req, res) => {
  res.json({ data: [{ id: 1, name: 'Hoàng Anh Tuấn' }] })
})

router.post('/login', loginValidator, loginController)

// Description register a new user
router.post('/register', registerValidator, registerController, wrapAsync(registerController))

export default router
