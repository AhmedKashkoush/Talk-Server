const { success, failure } = require('../public/response')
const { sendMail } = require('../public/mails')
const { hash, compare } = require('../public/bcrypt')
const { config } = require('dotenv')
config()
const name = process.env.APP_NAME
const user = process.env.MAIL_EMAIL

const sendCode = async(req, res) => {
  try {
    const { email } = req.body
    const code = Math.floor(Math.random() * 999999)
    const options = {
      from: `${name} <${user}>`,
      to: email,
      subject: 'Verification',
      text: `Your verification code is ${code}`
    }
    const sent = await sendMail(options);
    if (sent) success(res, 201, { message: 'code sent' })
  } catch (err) {
    failure(res, 500, { message: `failed: ${err}` })
  }
}

module.exports = { sendCode }