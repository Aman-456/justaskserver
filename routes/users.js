const upload = require('../middleware/multer')
const User = require('../modals/User')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const router = require("express").Router();

router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        const checkuser = await User.findOne({ email: email })
        checkuser && res.json({
            type: "failure",
            result: "Email already exist"
        });

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedpassword,
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
});
router.post('/registerWithImage',
    upload.single('file'),
    async (req, res, next) => {
        try {
            const email = req.body.email
            const find = await User.findOne({ email })
            find && res.json({
                type: "failure",
                result: "Email already exist"
            });
            const salt = await bcrypt.genSalt(10);
            const hashedpassword = await bcrypt.hash(req.body.password, salt);
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedpassword,
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
    });
router.post('/signin', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.json({ type: "failure", result: "No user found" });

        const validpass = await bcrypt.compare(req.body.password, user.password)
        !validpass && res.json({ type: "failure", result: "Wrong Password" });
        const { password, ...rest } = user._doc
        res.json({ type: "success", result: { ...rest } })
    }
    catch (e) {
        console.log(e);
    }
});
router.post('/getSingleUser', async (req, res, next) => {
    try {
        const _id = mongoose.Types.ObjectId(req.body.id)
        const current = req.body.current
        const user = await User.findById(_id)
        !user && res.json({ type: "failure", result: "No user found" });

        user.friends.includes(current) && res.json({ button: "Remove" })
        user.addfriendReq.includes(current) && res.json({ button: "Cancel" })

        const { password, ...rest } = user._doc
        res.json({ type: "success", result: { ...rest, button: "Add" } })
    }
    catch (e) {
        console.log("error", e);
        res.json({ type: "failure", result: "No user found" });
    }
});
router.put('/updateStatus', async (req, res, next) => {
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
});
router.delete('/delete', async (req, res, next) => {
    try {
        const _id = req.body.id
        const user = await User.deleteOne({ _id });
        !user && res.json({ type: "failure", result: "No user found" });
        const update = await User.findByIdAndUpdate(_id, { $set: req.body }, { new: true })
        // const { password, ...rest } = update
        console.log(update);
        res.json({
            type: "success", result: `Account has been deleted `
        });
    }
    catch (e) {
        console.log(e);
    }
});

// follow
router.put('/follow', async (req, res, next) => {
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
});

// unfollow
router.put('/unfollow', async (req, res, next) => {
    if (req.body.id !== req.body.unfollowid) {
        try {
            const unfollowid = await User.findById(req.body.unfollowid);
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
                    $pull: { pendingReq: req.body.unfollowid }
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
});

// removefriend
router.put('/removefriend', async (req, res, next) => {
    if (req.body.id !== req.body.unfollowid) {
        try {
            const removeid = await User.findById(req.body.unfollowid);
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
});

// friendslist
router.post('/friendslist', async (req, res, next) => {
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

});
exports.routes = router;