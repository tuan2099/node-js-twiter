import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqBody } from '~/models/Users/User.request'
import { hasPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { USER_MESSAGE } from '~/constants/message'

class UserService {
  // tạo access token
  private signAccessToken({ user_id, verify }: { user_id: string, verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPRISE_IN
      }
    })
  }
  // tạo refresh token
  private signRefreshToken({ user_id, verify }: { user_id: string, verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefeshToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPRISE_IN
      }
    })
  }

  private signEmailVerifyToken({ user_id, verify }: { user_id: string, verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPRISE_IN
      }
    })
  }

  private signForgotPassToken({ user_id, verify }: { user_id: string, verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.signForgotPassToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASS_TOKEN as string,
      options: {
        expiresIn: process.env.FORGOT_PASS_TOKEN_EXPRISE_IN
      }
    })
  }

  // tạo 1 function chung dùng nhiều lần - trả về 1 arr gồm refresh & access sau khi 2 hàm trên đã tạo xong
  private signAccessAndRefreshToken({ user_id, verify }: { user_id: string, verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }
  // đăng kí user mới
  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({ user_id: user_id.toString(), verify: UserVerifyStatus.Unverified })
    // add new user to the list
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        password: hasPassword(payload.password)
      })
    )

    // create access & refresh token for new user
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({ user_id: user_id.toString(), verify: UserVerifyStatus.Unverified })
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

  // check email trùng nhau
  async checkEmailExists(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  // tạo access & refresh token gắn vào userID đăng nhập
  async login({ user_id, verify }: { user_id: string, verify: UserVerifyStatus }) {
    // create token
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({ user_id, verify })
    // save refresh_token to database
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refresh_token
      })
    )
    // return token for user
    return {
      access_token,
      refresh_token
    }
  }

  // xóa bỏ refresh token để đăng xuất
  async logout(refresh_token: string) {
    // clear refresh token
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    //return message
    return {
      message: process.env.LOGOUT_SUCCESS
    }
  }

  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessAndRefreshToken({ user_id, verify: UserVerifyStatus.Verified }),
      databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: [
            {
              email_verify_token: '',
              verify: UserVerifyStatus.Verified,
              updated_at: '$$NOW'
            }
          ]
        }
      )
    ])

    const [access_token, refresh_token] = token

    return {
      access_token,
      refresh_token
    }
  }

  async resendVerifyEmail(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken({ user_id, verify: UserVerifyStatus.Unverified })
    console.log('resend email', email_verify_token)

    //
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          email_verify_token
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    return {
      message: USER_MESSAGE.RESEND_VERIFY_EMAIL_SUCCESS
    }
  }

  async forgotPass({ user_id, verify }: { user_id: string, verify: UserVerifyStatus }) {
    const forgot_pass_token = await this.signForgotPassToken({ user_id, verify })
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      { $set: { forgot_pass_token }, $currentDate: { updated_at: true } }
    )
    console.log('forgot pass token', forgot_pass_token)
    return {
      message: USER_MESSAGE.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }

  async resetPassword(user_id: string, password: string) {
    databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token: '',
          password: hasPassword(password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: USER_MESSAGE.RESET_PASSWORD_SUCCESS
    }
  }

  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          passord: 0,
          email_verify_token: 0,
          forgot_pass_token: 0
        }
      }
    )
    return user
  }
}

const userService = new UserService()
export default userService
