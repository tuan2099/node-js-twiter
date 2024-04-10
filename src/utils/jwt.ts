import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey?: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw reject(error)
      }
      resolve(token as string)
    })
  })
}

// verify access_token

export const verifyToken = ({
  token,
  publicKey = process.env.JWT_SECRET as string
}: {
  token: string
  publicKey?: string
}) => {
  return new Promise<jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(token, publicKey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      resolve(decoded as jwt.JwtPayload)
    })
  })
}
