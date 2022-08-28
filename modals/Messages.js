const mongoose = require('mongoose')
const Schema = mongoose.Schema
const messageSchema = new mongoose.Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },
    content: {
        type: String,
        trim: true
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: "Chats"
    }

},
    { timestamps: true }
)
const Message = mongoose.model('Messages', messageSchema)
module.exports = Message;