import { check, checkSchema } from 'express-validator'
import httpStatus from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { hasPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validator'

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: true,
        isEmail: true,
        trim: true,
        errorMessage: 'Please enter a valid email address',
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({ email: value, password: hasPassword(req.body.password) })
            if (user === null) {
              throw new Error(USER_MESSAGE.EMAIL_OR_PASSWORD_IS_INCORRECT)
            }
            req.user = user // truyền user vào req cho bên controller
            return true
          }
        }
      },
      password: {
        notEmpty: true,
        isString: true,
        isLength: {
          options: {
            min: 8,
            max: 100
          }
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1
          }
        },
        custom: {
          // kiểm tra 2 pass có trùng nhau hay không
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error('Password confirmation dose not match password')
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: USER_MESSAGE.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGE.NAME_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: USER_MESSAGE.NAME_LENGTH_MUST_BE_FROM_1_TO_100
        }
      },
      email: {
        notEmpty: true,
        isEmail: true,
        trim: true,
        errorMessage: 'Please enter a valid email address',
        custom: {
          options: async (value) => {
            const isExistsEmail = await userService.checkEmailExists(value)
            if (isExistsEmail) {
              throw new Error('Email already exists')
            }
            return true
          }
        }
      },
      password: {
        notEmpty: true,
        isString: true,
        isLength: {
          options: {
            min: 8,
            max: 100
          }
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1
          }
        },
        custom: {
          // kiểm tra 2 pass có trùng nhau hay không
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error('Password confirmation dose not match password')
            }
            return true
          }
        }
      },
      confirmPassword: {
        notEmpty: true,
        isString: true,
        isLength: {
          options: {
            min: 1,
            max: 100
          }
        }
      },
      date_of_birth: {
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          }
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        // kiểm tra xem auhourization có gửi lên hay không
        notEmpty: {
          errorMessage: USER_MESSAGE.ACCESS_TOKEN_IS_REQUIRED
        },
        // gửi rồi thì tiếp đến bước 2
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1] // lấy access token ra
            if (!access_token) {
              // check nếu rỗng
              throw new ErrorWithStatus({
                message: USER_MESSAGE.ACCESS_TOKEN_IS_REQUIRED,
                status: httpStatus.UNAUTHORIZED
              })
            }
            const decoded_authourization = await verifyToken({ token: access_token })
            req.decoded_authourization = decoded_authourization
            return true
          }
        }
      }
    },
    ['headers']
  )
)
