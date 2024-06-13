import { NextFunction, Request, Response } from 'express'
import { handleUploadImage } from '~/utils/file'
import mediaService from '~/services/media.services'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import path from 'path'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediaService.handleUploadImage(req)
  return res.json({
    message: 'Uploading image successfully',
    result: url
  })
}

export const serverImageController = async (req: Request, res: Response, next: NextFunction) => {
  const name = req.params
  console.log(name)
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name + '.jpg'), (err) => {
    if (err) {
      res.status((err as any).status).send('Not found')
      return
    }
  })
}

export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediaService.handleUploadVideo(req)
  return res.json({
    message: 'Uploading video successfully',
    result: url
  })
}

export const serverVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send('Not found')
      return
    }
  })
}
