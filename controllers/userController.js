const User = require('../modals/User')
const jwt = require('jsonwebtoken')

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        const checkuser = await User.findOne({ email: email })
        checkuser && res.json({
            type: "failure",
            result: "Email already exist"
        });

        const user = new User({
            name,
            email,
            password,
            profile: ""
        })
        user.save().then(e => {
            res.json({
                type: "success",
                result: {
                    name: e.name,
                    email: e.email,
                    profile: e.profile
                }
            });
        })
            .catch(e => {
                res.json({ type: "failure", result: "server error" });
            })

    }
    catch (e) {
        console.log(e);
    }
}
const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.json({ type: "failure", result: "No user found" });

        if (user && (await user.matchpass(req.body.password))) {
            const token = jwt.sign({ email: req.body.email }, process.env.SECRET_JWT)
            const { password, ...rest } = user._doc
            console.log(token);
            res.json({ type: "success", result: { ...rest, token: token } })
        }
        else {
            return res.json({ type: "failure", result: "Wrong Credentials" });
        }
    }
    catch (e) {
        console.log(e);
        return res.json({ type: "failure", result: "Internal Server Error" });

    }
}
const registerWithImage = async (req, res, next) => {
    try {
        const email = req.body.email
        const find = await User.findOne({ email })
        find && res.json({
            type: "failure",
            result: "Email already exist"
        });

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            profile: req.file.path
        })
        const save = await user.save();
        if (save) {
            res.json({
                type: "success",
                result: {
                    name: save.name,
                    email: save.email,
                    profile: save.profile
                }
            });
        }
        else {
            res.json({
                type: "failure",
                result: "server error"
            });
        }
    }
    catch (e) {
        console.log(e);
    }
}
const getSingleUser = async (req, res, next) => {
    try {
        const _id = req.body.id

        var button = ""
        const current = req.body.current
        const user = await User.findById(_id)
        if (!user) {
            return res.json({ type: "failure", result: "No user found" });
        }
        console.log("user", user);
        if (user.friends.includes(current)) {
            button = "Remove"
        }
        else if (user.addfriendReq.includes(current)) {
            button = "Cancel"
        }
        else {
            button = "Add"
        }

        const { password, ...rest } = user._doc
        res.json({ type: "success", result: { ...rest }, button })
    }
    catch (e) {
        console.log("error occured in getuser");
        res.json({ type: "failure", result: "No user found" });
    }
}
const updateStatus = async (req, res, next) => {
    try {
        console.log(req.body);
        const _id = req.body.id
        const user = await User.findOne({ _id });
        !user && res.json({ type: "failure", result: "No user found" });
        const update = await User.findByIdAndUpdate(_id, { $set: req.body }, { new: true })
        const { password, ...rest } = update._doc
        console.log(rest);
        res.json({ type: "success", result: { ...rest }, updated: "true" });
    }
    catch (e) {
        console.log(e);
    }
}
const VerifyEmail = async (req, res, next) => {
    try {
        const email = req.body.email
        const user = await User.findOne({ email });
        !user && res.json({ type: "failure", result: "No user found" });
        res.json({ type: "success" });
    }
    catch (e) {
        console.log(e);
    }
}
const updatePass = async (req, res, next) => {
    try {
        const email = req.body.email
        const pass = req.body.password
        const user = await User.findOne({ email });
        !user && res.json({ type: "failure", result: "No user found" });
        user.password = pass
        user
            .save()
            .then(() => {
                const { password, ...rest } = user._doc
                console.log("rest", rest);
                res.status(200).json({
                    type: "success",
                    result: { rest },
                    updated: "true"
                });
            })
            .catch(() => {
                res
                    .status(500)
                    .json({ type: "failure", result: "Server Not Responding" });
                return;
            });

    }
    catch (e) {
        console.log("error", e);
    }
}
const Delete = async (req, res, next) => {
    try {
        const _id = req.body.id
        const user = await User.deleteOne({ _id });
        !user && res.json({ type: "failure", result: "No user found" });
        // const { password, ...rest } = update
        console.log(update);
        res.json({
            type: "success", result: `Account has been deleted `
        });
    }
    catch (e) {
        console.log(e);
    }
}
const follow = async (req, res, next) => {
    if (req.body.usertofollowid !== req.body.id) {
        try {
            const usertofollowid = await User.findById(req.body.usertofollowid);
            const currentUser = await User.findById(req.body.id);

            if (!usertofollowid)
                res.json({
                    type: "failure",
                    result: "No user found"
                });

            if (
                !(usertofollowid.friends.includes(req.body.id)) &&
                !(usertofollowid.addfriendReq.includes(req.body.id))
            ) {
                await usertofollowid.updateOne({
                    $push: { addfriendReq: req.body.id }
                })
                await currentUser.updateOne({
                    $push: { pendingReq: req.body.usertofollowid }
                })
                res.json({
                    type: "success", result: `Request Sent`
                })
            }
            else res.json({
                type: "failure", result:
                    (usertofollowid.friends.includes(req.body.id))
                        ? `You are already friend with this account`
                        : `Request already sent to this account this account`


            });
        }
        catch (e) {
            res.json({
                type: "failure", result: `Can't Find the user or can't follow the user or user not found`
            });
        }
    }
    else res.json({
        type: "failure", result: `You can't follow your self`
    });
}
const unfollow = async (req, res, next) => {
    if (req.body.id !== req.body.usertounfollowid) {
        try {
            const unfollowid = await User.findById(req.body.usertounfollowid);
            const currentUser = await User.findById(req.body.id);
            if (!unfollowid)
                res.json({
                    type: "failure",
                    result: "No user found"
                });
            if (unfollowid.addfriendReq.includes(req.body.id)) {

                await unfollowid.updateOne({
                    $pull: { addfriendReq: req.body.id }
                })
                await currentUser.updateOne({
                    $pull: { pendingReq: req.body.usertounfollowid }
                })
                res.json({
                    type: "success", result: `Request Cancelled`
                })
            }
            else res.json({
                type: "failure", result: `You haven't send request to this account`
            });
        }
        catch (e) {

            res.json({
                type: "failure", result: `Can't Find the user or can't unfollow the user or user not found`
            });
        }
    }
    else res.json({
        type: "failure", result: `Server Error`
    });
}
const removefriend = async (req, res, next) => {
    if (req.body.id !== req.body.removeId) {
        try {
            const removeid = await User.findById(req.body.removeId);
            const currentUser = await User.findById(req.body.id);
            if (!removeid)
                res.json({
                    type: "failure",
                    result: "No user found"
                });
            if (removeid.friends.includes(req.body.id)) {

                await removeid.updateOne({
                    $pull: { friends: req.body.id }
                })
                await currentUser.updateOne({
                    $pull: { friends: req.body.removeid }
                })
                res.json({
                    type: "success", result: `Friend Removed`
                })
            }
            else res.json({
                type: "failure", result: `You aren't friends with this user`
            });
        }
        catch (e) {

            res.json({
                type: "failure", result: `Can't Find the user or can't unfollow the user or user not found`
            });
        }
    }
    else res.json({
        type: "failure", result: `Server Error`
    });
}
const friendList = async (req, res, next) => {
    try {
        const id = await User.findById(req.body.id);
        const friends = await id.friends;

        if (friends == [])
            res.json({
                type: "failure",
                result: "No users found"
            });

        const users = await User.find().where('_id').in(friends)

        res.json({ type: "success", list: users })
    }
    catch (e) {
        console.log("error");
        res.json({
            type: "failure",
            result: `Can't Find the users`
        });
    }

}
module.exports = {
    register,
    registerWithImage,
    signin,
    getSingleUser,
    updateStatus,
    VerifyEmail,
    updatePass,
    Delete,
    follow,
    unfollow,
    removefriend,
    friendList

}