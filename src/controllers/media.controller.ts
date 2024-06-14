import { NextFunction, Request, Response } from 'express'
import { handleUploadImage } from '~/utils/file'
import mediaService from '~/services/media.services'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import path from 'path'
import httpStatus from '~/constants/httpStatus'
import fs from 'fs'
import mime from 'mime'

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

export const serverVideoStreamController = async (req: Request, res: Response, next: NextFunction) => {
  const range = req.headers.range
  if (!range) {
    return res.status(httpStatus.NOT_FOUND).send('Required range headers')
  }
  const { name } = req.params
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name) // get video path
  const videoSize = fs.statSync(videoPath).size // get dung luọng video size
  const chunkSize = 10 ** 6
  const start = Number(range.replace(/\D/g, ''))
  const end = Math.min(start + chunkSize, videoSize - 1)

  const contentLength = end - start
  const contentType = mime.getType(videoPath) || 'video/*'
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }

  res.writeHead(httpStatus.PARTIAL_CONTENT, headers)

  const videoStream = fs.createReadStream(videoPath, { start, end })
  videoStream.pipe(res)
}
