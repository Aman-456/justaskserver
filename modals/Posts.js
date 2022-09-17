const mongoose = require('mongoose')
const Schema = mongoose.Schema



const PostSchema = new mongoose.Schema({
    Author: {
        type: Object
    },
    Title: {
        type: String,
        trim: true,
        required: true,
        Unique: true
    },
    Body: { type: String },
    Tags: {
        type: Array,
        required: true
    },
    Comments: {
        type: Schema.Types.ObjectId,
        ref: "Comments",
    },
    Solved: {
        type: Boolean,
        default: false
    },
    meta: {
        votes: Number,
        favs: Number,
        views: Number
    }
},
    { timestamps: true }
)
const Posts = mongoose.model('Posts', PostSchema)
module.exports = Posts;