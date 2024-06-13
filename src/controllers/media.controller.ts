import { NextFunction, Request, Response } from 'express'
import { handleUploadImage } from '~/utils/file'
import mediaService from '~/services/media.services'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediaService.handleUploadImage(req)
  return res.json({
    message: 'Uploading image successfully',
    result: url
  })
}
