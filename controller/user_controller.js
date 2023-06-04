const { success, failure } = require('../public/response')
const User = require('../model/user')

const uploadPhoto = async (req, res) => {}
const get = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    user.password = undefined
    success(res, 200, { data: user })
  } catch (err) {
    failure(res, 500, { message: err })
  }
}
const edit = async (req, res) => {}
const destroy = async (req, res) => {}

module.exports = {
  uploadPhoto,
  get,
  edit,
  destroy
}
