const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
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
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: "Users"
        },
    ],
    addfriendReq: [
        {
            type: Schema.Types.ObjectId,
            ref: "Users"
        },
    ],
    pendingReq: [
        {
            type: Schema.Types.ObjectId,
            ref: "Users"
        },
    ],
    bio: {
        type: String,
    },
    verify: { default: false, type: Boolean },
    otp: { type: Number },
    expireTime: { type: String },
},
    { timestamps: true }
)

userSchema.index({
    name: 'text',
    bio: "text"
})

userSchema.methods.matchpass = async function (pass, password) {
    return await bcrypt.compare(pass, password)
}



userSchema.pre('save', async function (next) {
    try {
        var user = this;
        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(user.password, salt)
        this.password = hashed
        next();
    }
    catch (e) {
        console.log(e);
    }
})


const User = mongoose.model('Users', userSchema)

module.exports = User;