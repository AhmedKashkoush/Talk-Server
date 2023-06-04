const { failure } = require('../public/response')
const jwt = require('jsonwebtoken')
const User = require('../model/user')

const authorization = async (req, res, next) => {
  try {
    const { authorization } = req.headers
    if (!authorization) return failure(res, 401, { message: 'unauthorized' })

    if (!authorization.includes('Bearer'))
      return failure(res, 401, { message: 'invalid token' })

    const token = authorization.split(' ')[1]
    if (!token) return failure(res, 401, { message: 'invalid token' })

    const { id } = req.params

    const user = await User.findById(id)

    if (!user)
      return failure(res, 404, { message: 'user with this id not found' })

    const data = jwt.verify(token, `${user.email}`)
    if (!data) return failure(res, 401, { message: 'invalid token' })

    if (data._doc._id !== id)
      return failure(res, 403, { message: 'access denied' })

    next()
  } catch (err) {
    failure(res, 500, { message: `failed: ${err}` })
  }
}

module.exports = authorization
