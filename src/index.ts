import express from 'express'
const app = express()
const port = 3000
import userRouter from '~/user.router'

app.use('/', userRouter)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
