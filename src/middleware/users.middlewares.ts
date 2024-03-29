import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validator'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      error: 'Missing email or pass'
    })
  }
  next()
}

export const registerValidator = validate(checkSchema({
  name: {
    notEmpty: true,
    isString: true,
    trim: true,
    isLength: {
      options: {
        min: 1,
        max: 100,
      },
      errorMessage: 'min value must be greater than 1 or greater than 100'
    }
  },
  email: {
    notEmpty: true,
    isEmail: true,
    trim: true,
    errorMessage: 'Please enter a valid email address'
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
    custom: { // kiểm tra 2 pass có trùng nhau hay không
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

}))
