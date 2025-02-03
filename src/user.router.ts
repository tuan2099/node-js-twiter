import express from 'express'
const userRouter = express.Router()

userRouter.use((req, res, next) => {
  console.log('hi')
  next()
  }
)

export default userRouter