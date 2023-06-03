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
  // USER NOT FOUND CODE => 404
  // WRONG CREDENTIALS | NOT VERIFIED CODE => 401
  // OTHERWISE CODE => 500
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return failure(res, 404, { message: 'user does not exist' })
    const isMatched = compare(password, user.password)
    if (!isMatched)
      return failure(res, 401, { message: 'your credentials are not correct' })
    if (!user.isVerified)
      return failure(res, 401, { message: 'user is not verified' })
    user.password = undefined
    const token = jwt.sign({ ...user }, `${email}${user.password}`)
    success(res, 200, { data: user, token })
  } catch (err) {
    failure(res, 500, { message: `failed: ${err}` })
  }
}

const sendCode = async (req, res) => {
  // SUCCESS CODE => 202
  // USER NOT FOUND CODE => 404
  // OTHERWISE CODE => 500
  try {
    const name = process.env.APP_NAME
    const sender = process.env.MAIL_EMAIL
    const { email } = req.body
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

const verifyCode = (req, res) => {
  // SUCCESS CODE => 202
}

module.exports = { signup, login, sendCode }
