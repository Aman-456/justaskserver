const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require("./User")
const chatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        trim: true,
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }],
    isRoomAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    latestmessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }

},
    { timestamps: true }
)
const Chats = mongoose.model('Chats', chatSchema)
module.exports = Chats;