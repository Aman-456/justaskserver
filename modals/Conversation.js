const mongoose = require('mongoose')
const Schema = mongoose.Schema
const conversatinoSchema = new mongoose.Schema({
    members: [{
        type: Schema.Types.ObjectId,
        ref: "Users"
    }]

},
    { timestamps: true }
)
const Conversation = mongoose.model('Conversation', conversatinoSchema)
module.exports = Conversation;