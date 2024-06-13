import express, { Request, Response, NextFunction } from 'express'
import router from './routes/users.route'
import DatabaseService from '~/services/database.services'
import { defaultErrorHandler } from '~/middleware/error.middleware'
import mediaRouter from './routes/media.route'
import { initFolder } from './utils/file'
import { UPLOAD_IMAGE_DIR } from './constants/dir'
import { config } from 'dotenv'
import staticRouter from './routes/static.route'

config()

const app = express()
const port = process.env.PORT || 4000

initFolder()

app.use(express.json())
app.use('/api', router)
app.use('/media', mediaRouter)
app.use('/static', staticRouter)
app.use(express.static(UPLOAD_IMAGE_DIR))

DatabaseService.connect()
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log('running in port 3000')
})
