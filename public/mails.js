const nodemailer = require('nodemailer')
const { config } = require('dotenv')
config()
const host = process.env.MAIL_HOST
const service = process.env.MAIL_SMTP
const user = process.env.MAIL_EMAIL
const pass = process.env.MAIL_PASSWORD
const auth = { user, pass }
const options = { host, service, auth }
const transporter = nodemailer.createTransport(options)
const sendMail = (options,cb) => {
  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err)
    } else {
      console.log(info.response)
    }
  })
}

// {
//     from: `${name} <${user}>`,
//     to: 'ahmedkashkoush3@gmail.com',
//     subject: 'Hi',
//     text: 'Test'
//   }

module.exports = { sendMail }
