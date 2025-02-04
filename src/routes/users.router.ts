import express from 'express'
import { loginValidator, registerValidator } from '~/middlewares/user.middleware'
import { loginController, registerController } from '~/controllers/users.controller'
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
usersRouter.post('/logout')
export default usersRouter
