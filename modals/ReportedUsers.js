const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reportedusersSchema = new mongoose.Schema({
    by: {
        type: Schema.Types.ObjectId, ref: "Users"
    },
    reported: {
        type: Schema.Types.ObjectId, ref: "Users"
    },
    message: {
        type: String
    },
    completed: { default: false, type: Boolean }
},
    { timestamps: true }
)
const Posts = mongoose.model('reportedusers', reportedusersSchema)
module.exports = Posts;