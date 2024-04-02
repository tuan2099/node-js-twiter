import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqBody } from '~/models/Users/User.request'
import { hasPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'

class UserService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        type: 'access_token'
      }
    })
  }
  async register(payload: RegisterReqBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hasPassword(payload.password)
      })
    )
    return result
  }
  async checkEmailExists(email: string) {
    const user = await databaseService.users.findOne({ email })
    console.log(user)
    return Boolean(user)
  }
}

const userService = new UserService()
export default userService
