const mongoose = require('mongoose')
const Schema = mongoose.Schema


const CommentReply = new Schema({
    Author: { type: Schema.Types.ObjectId, ref: "Users" },
    Body: { type: String },
}, { timestamps: true });


const Comment = new Schema({
    Author: { type: Schema.Types.ObjectId, ref: "Users" },
    reply: [CommentReply],
    Body: { type: String },

}, { timestamps: true });


const Unlike = new Schema({
    Author: { type: Schema.Types.ObjectId, ref: "Users" },
});

const PostSchema = new mongoose.Schema({
    Author: {
        type: Schema.Types.ObjectId, ref: "Users"
    },
    SavedBy: [{
        type: Schema.Types.ObjectId, ref: "Users"
    }],
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
    Comments: [Comment],
    Solved: {
        type: Boolean,
        default: false
    },
    Likes: {
        count: Number,
        liked: Array
    },
    UnLikes: [Unlike],
    Views: Number
},
    { timestamps: true }
)
const Posts = mongoose.model('Posts', PostSchema)
module.exports = Posts;