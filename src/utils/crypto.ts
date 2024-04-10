// has pasword để mã hóa khi lưu dưới databases
import { createHash } from 'crypto'

function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

export function hasPassword(password: string) {
  return sha256(password)
}
