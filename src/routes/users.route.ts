import express from 'express'
import { loginController, registerController } from '~/controllers/users.controller'
import { loginValidator } from '~/middleware/users.middlewares'
const router = express.Router()

router.get('/tweets', (req, res) => {
  res.json({ data: [{ id: 1, name: 'Hoàng Anh Tuấn' }] })
})

router.post('/login', loginValidator, loginController)
router.post('/register', registerController)

export default router
