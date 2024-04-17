import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'

export interface RegisterReqBody {
  name: string
  email: string
  password: string
  comfirmPassword: string
  date_of_birth: string
}

export interface TokenPayLoad extends JwtPayload {
  user_id: string
  token_type: TokenType
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface ForgotPassReqBody {
  email: string
}
