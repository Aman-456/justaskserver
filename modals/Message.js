const mongoose = require('mongoose')
const Schema = mongoose.Schema


const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: "Conversation"
    },
    text: { type: String },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },
},
    { timestamps: true }
)
const Message = mongoose.model('Message', MessageSchema)
module.exports = Message;