const mongoose = require('mongoose')
const Schema = mongoose.Schema

const message = new Schema(
  {
    chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    to: { type: Schema.Types.ObjectId, ref: 'User' },
    replyTo: { type: Schema.Types.ObjectId, ref: 'Message' },
    messageType: {
      type: String,
      enums: [
        'text',
        'image',
        'voice',
        'video',
        'file',
        'location',
        'combined'
      ],
      default: 'text'
    },
    attachment: String,
    status: {
      type: String,
      enums: ['sent', 'delivered', 'read'],
      default: 'sent'
    },
    timestamp: { type: Date, default: Date.now() },
    deliveredAt: Date,
    readedAt: Date
  },
  { timestamps: true, versionKey: false }
)

const Message = mongoose.model('Message', message)
module.exports = Message
