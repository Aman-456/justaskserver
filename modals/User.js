const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        min: 3,
        max: 20,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    profile: {
        type: String,
        default: ""
    },
    friends: {
        type: Array,
        default: []
    },
    addfriendReq: {
        type: Array,
        default: []
    },
    pendingReq: {
        type: Array,
        default: []
    },
    isRoomAdmin: {
        type: Boolean,
        default: false
    },
    bio: {
        type: String,
        max: 160
    }
},
    { timestamps: true }
)
const User = mongoose.model('Users', userSchema)
module.exports = User;