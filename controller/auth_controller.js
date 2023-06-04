const { validationResult } = require('express-validator')
const { success, failure } = require('../public/response')
const { sendMail } = require('../public/mails')
const { hash, compare } = require('../public/bcrypt')
const { config } = require('dotenv')
const User = require('../model/user')
const jwt = require('jsonwebtoken')
config()

const signup = async (req, res) => {
  // SUCCESS CODE => 200
  // VALIDATION FAILED CODE => 403
  // EMAIL TAKEN CODE => 409
  // OTHERWISE CODE => 500
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const message = errors.errors[0].msg
      return failure(res, 403, { message })
    }
    const body = req.body
    body.password = hash(body.password)
    const user = new User(body)
    await user.save()
    console.log(user)
    success(res, 200, { message: 'you signed in successfully' })
  } catch (err) {
    console.log(err)
    if (err.code === 11000)
      return failure(res, 409, { message: 'email is already taken' })
    failure(res, 500, { message: err })
  }
}

const login = async (req, res) => {
  // SUCCESS CODE => 200
  // BAD REQUES CODE => 400
  // USER NOT FOUND CODE => 404
  // WRONG CREDENTIALS | NOT VERIFIED CODE => 401
  // OTHERWISE CODE => 500
  try {
    const { email, password } = req.body
    if (!email || !password)
      return failure(res, 400, { message: 'provide email and password' })
    const user = await User.findOne({ email })
    if (!user) return failure(res, 404, { message: 'user does not exist' })
    const isMatched = compare(password, user.password)
    if (!isMatched)
      return failure(res, 401, { message: 'your credentials are not correct' })
    if (!user.isVerified)
      return failure(res, 401, { message: 'user is not verified' })
    user.isOnline = true
    await user.save()
    user.password = undefined
    const token = jwt.sign({ ...user }, `${email}`)
    success(res, 200, { data: user, token })
  } catch (err) {
    failure(res, 500, { message: `failed: ${err}` })
  }
}

const sendCode = async (req, res) => {
  // SUCCESS CODE => 202
  // BAD REQUES CODE => 400
  // USER NOT FOUND CODE => 404
  // OTHERWISE CODE => 500
  try {
    const name = process.env.APP_NAME
    const sender = process.env.MAIL_EMAIL
    const { email } = req.body
    if (!email) return failure(res, 400, { message: 'provide email' })
    const user = await User.findOne({ email })
    if (!user) return failure(res, 404, { message: 'user does not exist' })
    const code = Math.floor(Math.random() * 999999).toString()
    const options = {
      from: `${name} <${sender}>`,
      to: email,
      subject: 'Verification',
      text: `Your verification code is ${code}`
    }
    const sent = await sendMail(options)
    if (sent) {
      user.otp = code
      console.log(user)
      await user.save()
      success(res, 202, { message: 'code sent' })
    }
  } catch (err) {
    failure(res, 500, { message: `failed: ${err}` })
  }
}

const verifyCode = async (req, res) => {
  // SUCCESS CODE => 202
  // BAD REQUES CODE => 400
  // NOT VERIFIED CODE => 401
  // USER NOT FOUND CODE => 404
  // USER ALREADY VERIFIED CODE => 409
  // OTHERWISE CODE => 500
  try {
    const { email, code } = req.body
    const user = await User.findOne({ email })
    if (!email || !code)
      return failure(res, 400, { message: 'provide email and code' })
    if (!user) return failure(res, 404, { message: 'user does not exist' })
    if (user.isVerified)
      return failure(res, 409, { message: 'user is already verified' })
    if (user.otp !== code)
      return failure(res, 401, { message: 'verification failed' })
    user.isVerified = true
    user.otp = ''
    await user.save()
    success(res, 200, { message: 'verification success' })
  } catch (err) {
    failure(res, 500, { message: `failed: ${err}` })
  }
}

module.exports = { signup, login, sendCode, verifyCode }
