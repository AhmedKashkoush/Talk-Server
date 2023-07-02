const { success, failure } = require('../public/response')
const User = require('../model/user')
const locale = require('../public/locale')

const uploadPhoto = async (req, res) => {}
const get = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
      .select('-password')
      .populate('friends', '-password -friends')
    success(res, 200, { data: user })
  } catch (err) {
    failure(res, 500, { message: err })
  }
}
const edit = async (req, res) => {}
const destroy = async (req, res) => {}

const addFriend = async (req, res) => {
  try {
    const { lang } = req.query
    const currentLocale = locale[lang || 'en']
    const { id, friendId } = req.params
    if (!id || !friendId)
      return failure(res, 400, { message: currentLocale.provideUserAndFriend })
    if (id === friendId)
      return failure(res, 400, { message: currentLocale.cannotAddSameUser })
    const user = await User.findById(id)
    const friend = await User.findById(friendId)
    if (!friend)
      return failure(res, 404, { message: currentLocale.friendNotFound })
    if (!friend.isVerified)
      return failure(res, 401, { message: currentLocale.friendNotVerified })
    if (!user.friends.includes(friend))
      return failure(res, 409, { message: currentLocale.friendExists })
    user.friends.push(friend)
    friend.friends.push(user)
    await user.save()
    await friend.save()
    console.log('User:', user)
    console.log('Friend:', friend)
    success(res, 200, { message: currentLocale.friendAdded })
  } catch (err) {
    failure(res, 500, { message: err })
  }
}

module.exports = {
  uploadPhoto,
  get,
  edit,
  destroy,
  addFriend
}
