import express, { Request, Response, NextFunction } from 'express'
import router from './routes/users.route'
import DatabaseService from '~/services/database.services'
import { defaultErrorHandler } from '~/middleware/error.middleware'
import mediaRouter from './routes/media.route'
import { initFolder } from './utils/file'
import { config } from 'dotenv'

config()

const app = express()
const port = process.env.PORT || 4000

initFolder()

app.use(express.json())
app.use('/api', router)
app.use('/media', mediaRouter)

DatabaseService.connect()
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log('running in port 3000')
})
