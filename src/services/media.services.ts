import { Request } from 'express'
import { getNameFromFullname, handleUploadSingleImage } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_DIR } from '~/constants/dir'
import path from 'path'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { config } from 'dotenv'
config()

class MediaService {
  async handleUploadSingleImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    const newName = getNameFromFullname(file.newFileName)
    const newPath = path.resolve(UPLOAD_DIR, `${newName}.jpg`)
    await sharp(file.filePath).jpeg().toFile(newPath)
    fs.unlinkSync(file.filePath)
    return isProduction ? `${process.env.HOST}/medias/${newName}.jpg` : `http://localhost${process.env.PORT}/media/${newName}.jpg`
  }
}

const mediaService = new MediaService()

export default mediaService
