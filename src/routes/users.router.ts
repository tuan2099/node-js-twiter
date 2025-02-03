import express from 'express'
import { loginValidator } from '~/middlewares/user.middleware'
import { loginController } from '~/controllers/users.controller'
const usersRouter = express.Router()

usersRouter.post('/login', loginValidator, loginController)

export default usersRouter
