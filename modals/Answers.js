const mongoose = require('mongoose')
const Schema = mongoose.Schema



const AnswersSchema = new mongoose.Schema({
    Post: {
        type: Schema.Types.ObjectId,
        ref: "Posts",
        required: true
    },
    Author: Object,
    Title: {
        type: String,
        trim: true,
        required: true,
        Unique: true
    },
    bBdy: String,
    Comments: {
        type: Schema.Types.ObjectId,
        ref: "Comments",
    },
    Solved: {
        type: Boolean,
        default: false
    },
    Reply: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
        body: { type: String }
    }]
},
    { timestamps: true }
)
const Answers = mongoose.model('Posts', AnswersSchema)
module.exports = Answers;