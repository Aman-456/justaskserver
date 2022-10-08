const mongoose = require('mongoose')
const Schema = mongoose.Schema



const SavedPostSchema = new mongoose.Schema({
    Author: {
        type: Schema.Types.ObjectId, ref: "Users"
    },
    Post: {
        type: Schema.Types.ObjectId, ref: "Posts"
    },
},
    { timestamps: true }
)
const Posts = mongoose.model('Saved', SavedPostSchema)
module.exports = Posts;