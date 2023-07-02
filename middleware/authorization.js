const { failure } = require('../public/response')
const jwt = require('jsonwebtoken')
const User = require('../model/user')
const locale = require('../public/locale')

const authorization = async (req, res, next) => {
  const { lang } = req.query
  const currentLocale = locale[lang || 'en']
  try {
    const { authorization } = req.headers
    if (!authorization) return failure(res, 401, { message: currentLocale.unauthorized })

    if (!authorization.includes('Bearer'))
      return failure(res, 401, { message: currentLocale.invalidToken })

    const token = authorization.split(' ')[1]
    if (!token) return failure(res, 401, { message: currentLocale.invalidToken })

    const { id } = req.params

    const user = await User.findById(id)

    if (!user)
      return failure(res, 404, { message: currentLocale.userNotFound })

    const data = jwt.verify(token, `${user.email}`)
    if (!data) return failure(res, 401, { message: currentLocale.invalidToken })

    if (data._doc._id !== id)
      return failure(res, 403, { message: currentLocale.accessDenied })

    next()
  } catch (err) {
    failure(res, 500, { message: `failed: ${err}` })
  }
}

module.exports = authorization
