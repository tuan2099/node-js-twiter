import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqBody } from '~/models/Users/User.request'
import { hasPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'

class UserService {
  // tạo access token
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPRISE_IN
      }
    })
  }
  // tạo refresh token
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefeshToken
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPRISE_IN
      }
    })
  }
  // tạo 1 function chung dùng nhiều lần - trả về 1 arr gồm refresh & access sau khi 2 hàm trên đã tạo xong
  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }
  // đămh kí user mới
  async register(payload: RegisterReqBody) {
    // add new user to the list
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hasPassword(payload.password)
      })
    )
    // conver id user to string
    const user_id = result.insertedId.toString()
    // create access & refresh token for new user
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    // add access & refresh token to user
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refresh_token
      })
    )
    return {
      access_token,
      refresh_token
    }
  }
  // async refreshToken(user_id: string) {
  //   const [] = Promise.all([
  //     this.signAccessToken({user_id, verify: UserVerifuStatus.Verified}),
  //   ])
  // }

  // tìm trong users db xem có email nào trùng với email gửi lên không
  async checkEmailExists(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  // tạo access & refresh token gắn vào userID đăng nhập
  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refresh_token
      })
    )
    return {
      access_token,
      refresh_token
    }
  }

  // xóa bỏ refresh token để đăng xuất
  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: process.env.LOGOUT_SUCCESS
    }
  }
}

const userService = new UserService()
export default userService
