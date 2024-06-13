import { Router } from 'express'
import { uploadImageController, uploadVideoController } from '~/controllers/media.controller'
import { accessTokenValidator, verifiedUserValidator } from '~/middleware/users.middlewares'
import { wrapAsync } from '~/utils/handles'
const mediaRouter = Router()

mediaRouter.post('/upload-image', accessTokenValidator, verifiedUserValidator, wrapAsync(uploadImageController))

mediaRouter.post('/upload-video', accessTokenValidator, verifiedUserValidator, wrapAsync(uploadVideoController))

export default mediaRouter
