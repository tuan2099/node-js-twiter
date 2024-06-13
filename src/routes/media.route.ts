import { Router } from 'express'
import { uploadImageController } from '~/controllers/media.controller'
import { wrapAsync } from '~/utils/handles'
const mediaRouter = Router()

mediaRouter.post('/upload-image', wrapAsync(uploadImageController))

export default mediaRouter
