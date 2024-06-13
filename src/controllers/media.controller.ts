import { NextFunction, Request, Response } from 'express'
import { handleUploadSingleImage } from '~/utils/file'
import mediaService from '~/services/media.services'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediaService.handleUploadSingleImage(req)
  return res.json({
    message: 'Uploading image successfully',
    result: url
  })
}
