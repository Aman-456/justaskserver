const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
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
    bio: {
        type: String,
        length: 20
    },
},
    { timestamps: true }
)

userSchema.methods.matchpass = async function (pass, password) {
    return await bcrypt.compare(pass, password)
}

userSchema.pre("save", async function (next) {

    // const salt = await bcrypt.genSalt(10)
    // this.password = await bcrypt.hash(this.password, salt)

    if (!this.isModified('password')) {
        next();
        return;
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)

})

const User = mongoose.model('Users', userSchema)
module.exports = User;