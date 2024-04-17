import {} from 'express'
import User from './models/schemas/User.schema'
import { TokenPayLoad } from './models/Users/User.request'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authourization?: TokenPayLoad
    decoded_refresh_token?: TokenPayLoad
    decoded_email_verify_token?: TokenPayLoad
    decoded_forgot_password_token?: TokenPayLoad
  }
}
