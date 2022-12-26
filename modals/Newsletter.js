const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50
    },
},
    { timestamps: true }
)

const NewsLetter = mongoose.model('NewsLetter', userSchema)

module.exports = NewsLetter;