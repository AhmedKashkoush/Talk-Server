const mongoose = require('mongoose')
const Schema = mongoose.Schema

const group = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ''
    },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' }
  },
  { timestamps: true, versionKey: false }
)

const Group = mongoose.model('Group', group)
module.exports = Group
