import { Router } from 'express'
import { serverImageController } from '~/controllers/media.controller'

const staticRouter = Router()

staticRouter.get('/image/:name', serverImageController)

export default staticRouter
