import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import formidable from 'formidable'
import path from 'path'
import { handleUploadImage } from '~/utils/file'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const data = await handleUploadImage(req)
  return res.json({
    result: data
  })
}
