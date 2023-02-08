const mongoose = require('mongoose')
const Schema = mongoose.Schema


const MessageSchema = new mongoose.Schema({
    chat: {
        type: Schema.Types.ObjectId,
        ref: "Chat"
    },
    content: {
        type: String
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],

},
    { timestamps: true }
)
const Message = mongoose.model('Message', MessageSchema)
module.exports = Message;