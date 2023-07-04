const mongoose = require('mongoose')
const Schema = mongoose.Schema

const user = new Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required']
    },
    birth: {
        type: Date,
        required: [true, 'birth date is required']
    },
    gender: {
        type: String,
        required: [true, 'gender is required']       
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'email is required'],
    //   validate: {
    //     validator: async function(email) {
    //       const user = await this.constructor.findOne({ email })
    //       return !user
    //     },
    //     message: props => 'email is already taken'
    //   }
    },
    phone: {
      type: String,
      required: [true, 'phone is required']
    },
    password: {
      type: String,
      required: [true, 'password is required']
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    image: {
      type: String,
      default: ''
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    lastSeen: Date,
    otp: {
      type: String,
      default: ''
    },
    deviceTokens: [
      {
        type: String,
        default: ''
      }
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    chats: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Chat'
      }
    ],
    blockList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const User = mongoose.model('User', user)
module.exports = User
