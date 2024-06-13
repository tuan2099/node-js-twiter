export enum TokenType {
  AccessToken,
  RefeshToken,
  ForgotPasswordToken,
  EmailVerifyToken,
  signForgotPassToken
}

export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}

export enum MediaType {
  Image,
  Video
}
