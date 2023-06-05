const { success, failure } = require('../public/response')
const User = require('../model/user')

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
    const { id, friendId } = req.params
    if (!id || !friendId)
      return failure(res, 400, { message: 'provide user id and friend id' })
    if (id === friendId)
      return failure(res, 400, { message: 'you cannot add the same user' })
    const user = await User.findById(id)
    const friend = await User.findById(friendId)
    if (!friend)
      return failure(res, 404, { message: 'friend with this id not found' })
    if (!friend.isVerified)
      return failure(res, 401, { message: 'friend with this id not verified' })
    if (!user.friends.includes(friend))
      return failure(res, 409, { message: 'friend already exists' })
    user.friends.push(friend)
    friend.friends.push(user)
    await user.save()
    await friend.save()
    console.log('User:', user)
    console.log('Friend:', friend)
    success(res, 200, { message: 'friend added' })
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
