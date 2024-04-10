import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { USER_MESSAGE } from '~/constants/message'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { validate } from '~/utils/validator'

export const loginValidator = validate(
  checkSchema({
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      errorMessage: 'Please enter a valid email address',
      custom: {
        options: async (value, { req }) => {
          const user = await databaseService.users.findOne({ email: value })
          if (user == null) {
            throw new Error(USER_MESSAGE.USER_NOT_FOUND)
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
  })
)

export const registerValidator = validate(
  checkSchema({
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
  })
)

// export const accessTokenValidator = validate()
