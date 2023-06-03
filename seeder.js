const mongoose = require('mongoose')
const User = require('./model/user')
mongoose.set("strictQuery",false)
mongoose
  .connect('mongodb://127.0.0.1:27017/talkdb')
  .then(() => {
    deleteAll()
  })

const deleteAll = async() => {
    await User.deleteMany()
}