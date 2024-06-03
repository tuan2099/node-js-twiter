import { Request } from 'express'
import { getNameFromFullname, handleUploadSingleImage } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_DIR } from '~/constants/dir'
import path from 'path'
import fs from 'fs'

class MediaService {
  async handleUploadSingleImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    const newName = getNameFromFullname(file.newFileName)
    const newPath = path.resolve(UPLOAD_DIR, `${newName}.jpg`)
    await sharp(file.filePath).jpeg().toFile(newPath)
    fs.unlinkSync(file.filePath)
    return `${newName}`
  }
}

const mediaService = new MediaService()

export default mediaService
