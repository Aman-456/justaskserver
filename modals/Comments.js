const mongoose = require('mongoose')
const Schema = mongoose.Schema


const CommentsSchema = new Schema({
    Post: { type: Schema.Types.ObjectId, ref: "Posts" },
    User: { type: Object },
    Body: { type: String },

});

const Comments = mongoose.model('Comments', CommentsSchema)
module.exports = Comments;