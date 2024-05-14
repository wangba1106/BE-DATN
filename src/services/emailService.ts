import 'dotenv/config'
import nodemailer from 'nodemailer'
import models from '../db/models'
import { CustomErrorHandler } from '../utils/ErrorHandling'
import { StatusCodes } from 'http-status-codes'
import moment from 'moment'
import UI_SendMail from '../html/mail'
import { generateCodeNumbers, generateExpiration, isExpiredAfter, isExpiredBefore } from '../utils/utils'
import emailTitles from '../constants/email'

class emailService {
  constructor(
    private emailAddress = process.env.EMAIL_ADDRESS as string,
    private emailPassword = process.env.EMAIL_PASSWORD as string
  ) {}

  // Gửi mail
  async sendEmail(title: string, email: string, code: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.emailAddress,
        pass: this.emailPassword
      }
    })

    // Cải tiến sau, tạm thời như vậy
    const body = await transporter.sendMail({
      from: `"Admin mạng xã hội DevBook 👻" <${this.emailAddress}>`,
      to: email,
      subject: 'Mạng xã hội DevBook',
      text: 'Xác thực email',
      html: UI_SendMail(title, email, code)
    })

    return body
  }

  // Xác thực email
  async verifyEmail(email: string, code: string) {
    const now = moment()
    const user = await models.User.findOne({ where: { email } })

    if (!user) {
      throw new CustomErrorHandler(StatusCodes.NOT_FOUND, 'Email không tồn tại!')
    }

    if (user.is_auth) {
      throw new CustomErrorHandler(StatusCodes.FORBIDDEN, 'Email đã được xác thực!')
    }

    if (user.code !== code) {
      throw new CustomErrorHandler(StatusCodes.BAD_REQUEST, 'Mã xác nhận không chính xác!')
    }

    if (isExpiredBefore(user.expires)) {
      throw new CustomErrorHandler(StatusCodes.BAD_REQUEST, 'Mã xác nhận đã hết hạn!')
    }

    user.code = ''
    user.is_auth = true

    await user.save()

    return {
      message: 'Đã xác thực email',
      data: {}
    }
  }

  // Tạo mã xác thực email mới
  async newAuthCodeEmail(email: string) {
    const now = moment()
    const user = await models.User.findOne({ where: { email } })
    const newCode = generateCodeNumbers(6).toString()
    const newExpires = generateExpiration(2, 'minutes')

    if (!user) {
      throw new CustomErrorHandler(StatusCodes.NOT_FOUND, 'Email không tồn tại!')
    }

    if (isExpiredAfter(user.expires)) {
      throw new CustomErrorHandler(StatusCodes.BAD_REQUEST, 'Mã xác thực hiện tại vẫn còn hiệu lực!')
    }

    const dataSendMail = await this.sendEmail(emailTitles.emailAuthentication, email, newCode)

    user.code = newCode
    user.expires = newExpires
    user.save()

    return {
      message: 'Đã gửi mã xác nhận mới !',
      data: {
        accepted: dataSendMail.accepted
      }
    }
  }
}

export default new emailService()