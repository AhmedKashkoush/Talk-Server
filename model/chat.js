const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chat = new Schema(
  {
    user1: { type: Schema.Types.ObjectId, ref: 'User' },
    user2: { type: Schema.Types.ObjectId, ref: 'User' },
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' }
  },
  { timestamps: true, versionKey: false }
)

const Chat = mongoose.model('Chat', chat)
module.exports = Chat
