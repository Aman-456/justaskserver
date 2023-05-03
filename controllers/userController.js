const User = require('../modals/User')
const ReportUser = require('../modals/ReportedUsers')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")
var fs = require("fs");
const path = require("path")
var handlebars = require("handlebars");
const bcrypt = require("bcrypt")
const { default: mongoose } = require('mongoose');


const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        const checkuser = await User.findOne({ email: email })
        if (!password) return res.json({ type: "failure", result: "enter password correctly" })
        checkuser && res.json({
            type: "failure",
            result: "Email already exist"
        });

        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(password, salt)
        const user = new User({
            name,
            email,
            password: hashed
        })
        sendEmail(user.email, user.name, user, res);
    }
    catch (e) {
        console.log(e);
        return res.json({ type: "failure", result: e.message })
    }
}


const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        // console.log(user, req.body);
        if (!user)
            return res.json({ type: "failure", result: "No user found" });

        else if (user && (await user.matchpass(req.body.password, user.password))) {
            if (!user?.verify) {
                return res.json({ type: "failure", result: "verify your email first!" })
            }
            const token = jwt.sign(
                { id: user._id },
                process.env.SECRET_JWT,
            )

            const { password, ...rest } = user._doc

            res.json({ type: "success", result: { ...rest, token } })
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
        if (!req.body?.password) return res.json({ type: "failure", result: "enter password correctly" })

        const find = await User.findOne({ email })
        if (find) return res.json({
            type: "failure",
            result: "Email already exist"
        });


        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(req.body.password, salt)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashed,
            profile: req.body.file
        })
        sendEmail(user.email, user.name, user, res, req);
    }
    catch (e) {
        console.log(e);
        return res.json({ type: "failure", result: e.message })
    }
}

const UpdatePorfile = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user });
        if (fs.existsSync(user.profile)) {
            fs.unlinkSync(user.profile)
        }
        const find = await User.findByIdAndUpdate(
            req.user,
            { $set: { profile: req.file.path } },
            { new: true }
        )
            .populate("friends")
            .populate("addfriendReq")
            .populate("pendingReq")
        if (find) {
            res.json({
                type: "success",
                result: find
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
        return res.json({ type: "failure", result: e.message })
    }
}
const updateStatus = async (req, res, next) => {
    try {
        const _id = req.body.id
        const user = await User.findOne({ _id });
        !user && res.json({ type: "failure", result: "No user found" });
        const update = await User.findByIdAndUpdate(_id, { $set: req.body }, { new: true })
            .populate("friends")
            .populate("addfriendReq")
            .populate("pendingReq")
        const { password, ...rest } = update._doc
        res.json({ type: "success", result: { ...rest }, updated: "true" });
    }
    catch (e) {
        console.log(e);
    }
}
// user signup verify
var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
        if (err) {
            callback(err);
            throw err;
        } else {
            callback(null, html);
        }
    });
};
async function sendEmail(email, name, user, res) {
    try {
        const transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: `${process.env.EMAIL_ADDRESS}`,
                pass: `${process.env.APP_PASS || process.env.EMAIL_PASSWORD}`,
            },
        });
        const URL = `http://${process.env.HOST}:${process.env.PORT}/api/user/verify?token=${user._id} `;
        readHTMLFile(
            "./templates/emailverification.html",
            async function (err, html) {
                var template = handlebars.compile(html);
                var replacements = {
                    name: user.name,
                    link: URL,
                };
                var htmlToSend = template(replacements);

                const mailOptions = {
                    from: `${process.env.EMAIL_ADDRESS} `,
                    to: email,
                    subject: "Please confirm account",
                    html: htmlToSend,
                };

                await transporter.verify();

                //Send Email
                transporter.sendMail(mailOptions, async (err, response) => {
                    if (err) {
                        res.status(500).json({ type: "failure", result: "Server Not Responding" });
                        return;
                    } else {

                        await user.save().then(async () => {
                            return res.status(200).json({
                                type: "success",
                                result: "Please verify your email!",
                            });
                        }).catch(e => {
                            if (e.code === 11000)
                                return res.json({ type: "failure", result: "duplicate email or name!" });
                            else
                                res.status(200).json({
                                    type: "failue",
                                    result: "Customer Registeration Error",
                                });
                        })

                    }
                });
            }
        );
    } catch (error) {
        console.log(error + "error");
        return res.json({ type: "failure", result: error.message })
    }
}
const Verify = async (req, res) => {
    const Id = req.query.token;
    var user = await User.findOne({ _id: Id });
    if (user) {
        if (user.verify == true) {
            return res.redirect(`${"http://localhost:3000"}`)
        }
        user.verify = true;
        await user.save()
        return res.sendFile(
            path.join(__dirname + "../../templates/emailverified.html")
        );

    }
    else {
        res.json({ type: "failure", result: "Server Not Responding" });
    }

};
const OTP = async (req, res) => {
    try {
        var user = await User.findOne({ email: req.body.email });
        if (user) {
            sendOTP(user.email, user.name, user, res);
        } else {
            res.status(401).json({ type: "failure", result: "Email Does not Exist" });
        }
    } catch (error) {
        console.log(error + "error");
        res.status(500).json({ type: "failure", result: "Server Not Responding" });
    }
};
async function sendOTP(email, name, user, res) {
    try {
        var otp = Math.floor(1000 + Math.random() * 9000);
        const now = new Date();
        const expiration_time = new Date(now.getTime() + 10 * 60000);

        user.otp = otp;
        user.expireTime = expiration_time
        const u = await user.save();
        if (!u) {
            return res
                .status(500)
                .json({ type: "failure", result: "Server Not Responding" });
        }

        else {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: `${process.env.EMAIL_ADDRESS} `,
                    pass: `${process.env.APP_PASS || process.env.EMAIL_PASSWORD} `,
                },
            });

            const mailOptions = {
                from: `${process.env.EMAIL_ADDRESS} `,
                to: `${email} `,
                subject: "OTP: For Change Password",
                text:
                    `Dear ${name} \, \n\n` +
                    "OTP for Change Password is : \n\n" +
                    `${otp} \n\n` +
                    "This is a auto-generated email. Please do not reply to this email.\n\n",
            };

            await transporter.verify();

            //Send Email
            transporter.sendMail(mailOptions, (err, response) => {

                if (err) {
                    return res
                        .status(500)
                        .json({ type: "failure", result: "Server Not Responding" });
                } else {
                    res.status(200).json({
                        type: "success",
                        result: "OTP has been sent",
                    });
                }
            });
        }

    } catch (error) {
        console.log(error + "error");
        return res.json({ type: "failure", result: error.message })
    }
}
const verifyOTP = async (req, res) => {
    if (!req.body.number || !req.body.email) {
        return res.json({ type: "failure", result: "either email or otp is undefined" })
    }
    var otp = req.body.number;
    const data = await User.findOne({ email: req.body.email });

    const now = new Date();
    if (now > new Date(data.expireTime)) {
        return res.status(401).json({ type: "failure", result: "OTP has been expired" });
    } else {
        if (otp == data.otp) {
            res
                .status(200)
                .json({ type: "success", result: "OTP has been verified" });
        } else {
            res.status(401).json({ type: "failure", result: "OTP is incorrect" });
        }
    }
};

const changePassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)
    user.password = hashed;
    user
        .save()
        .then(() => {
            res.status(200).json({
                type: "success",
                result: "Password has been changed",
            });
        })
        .catch((error) => {
            res
                .status(500)
                .json({ type: "failure", result: "Server Not Responding" });
            return;
        });
};
const DELETEUSER = async (req, res, next) => {
    try {
        const _id = req.user
        console.log(req.user);
        const user = await User.findByIdAndDelete(_id);
        if (!user)
            return res.json({ type: "failure", result: "No user found" });
        // const { password, ...rest } = update
        res.json({
            type: "success", result: `Account has been deleted `
        });
    }
    catch (e) {
        console.log(e);
        return res.json({ type: "failure", result: e.message });
    }
}
const getSingleUser = async (req, res, next) => {
    try {
        const _id = req.body.id

        var button = ""
        const current = req.user
        const user = await User.findById(_id)

        if (!user) {
            return res.json({ type: "failure", result: "No user found" });
        }
        const check = (arr) => {
            let flag = false
            arr.forEach(e => {
                if (String(e) == String(current)) {
                    return flag = true
                }
            })
            return flag
        }
        if (check(user.friends)) {
            button = "Remove"
        }
        else if (check(user.addfriendReq)) {
            button = "Cancel"
        }
        else button = "Add"
        const newuser = await User.findById(_id)
            .populate("friends")
            .populate("addfriendReq")
            .populate("pendingReq")
        const { password, ...rest } = newuser._doc
        res.json({ type: "success", result: { ...rest }, button })
    }
    catch (e) {
        console.log("error occured in getuser", e);
        res.json({ type: "failure", result: "No user found" });
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
                }, { new: true })
                await currentUser.updateOne({
                    $push: { pendingReq: req.body.usertofollowid }
                })
                const user = await User.findById(req.body.usertofollowid)
                    .populate("friends")
                    .populate("addfriendReq")
                    .populate("pendingReq")

                res.json({
                    type: "success", result: `Request Sent`, data: user
                })
            }
            else res.json({
                type: "failure", result:
                    (usertofollowid.friends.includes(req.body.id))
                        ? `You are already friend with this account`
                        : `Request already sent to this account`


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
            const unfollowid = await User.findById(req.body.usertounfollowid)


            const currentUser = await User.findById(req.body.id);
            if (!unfollowid)
                return res.json({
                    type: "failure",
                    result: "No user found"
                });
            if (unfollowid.addfriendReq.includes(req.body.id)) {

                await unfollowid.updateOne({
                    $pull: { addfriendReq: req.body.id }
                }, { new: true })
                await currentUser.updateOne({
                    $pull: { pendingReq: req.body.usertounfollowid }
                })

                const user = await User.findById(req.body.usertounfollowid)
                    .populate("friends")
                    .populate("addfriendReq")
                    .populate("pendingReq")

                res.json({
                    type: "success", result: `Request Cancelled`, data: user
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
            const currentUser = await User.findById(req.body.id)
                .populate("friends")
                .populate("addfriendReq")
                .populate("pendingReq")
            if (!removeid)
                res.json({
                    type: "failure",
                    result: "No user found"
                });
            if (removeid.friends.includes(req.body.id)) {
                await removeid.updateOne({
                    $pull: { friends: req.body.id }
                }, { new: true })
                await currentUser.updateOne({
                    $pull: { friends: req.body.removeId }
                }, { new: true })
                const user = await User.findById(req.body.id)
                    .populate("friends")
                    .populate("addfriendReq")
                    .populate("pendingReq")

                res.json({
                    type: "success", result: `Friend Removed`,
                    data: user
                })
            }

            else if (
                removeid.pendingReq.includes(req.body.id) ||
                currentUser.addfriendReq.includes(req.body.removeId)
            ) {
                console.log("fisrt2");

                await removeid.updateOne({
                    $pull: { pendingReq: req.body.id }
                })
                await currentUser.updateOne({
                    $pull: { addfriendReq: req.body.removeId },
                }, { new: true })
                const user = await User.findById(req.body.id)
                    .populate("friends")
                    .populate("addfriendReq")
                    .populate("pendingReq")
                res.json({
                    type: "success", result: `Friend Removed`
                    , data: user

                })
            }
            else if (removeid.addfriendReq.includes(req.body.id)) {
                console.log("fisrt3");

                await removeid.updateOne({
                    $pull: { addfriendReq: req.body.id }
                })
                await currentUser.updateOne({
                    $pull: { pendingReq: req.body.removeId }
                })
                const user = await User.findById(req.body.id)
                    .populate("friends")
                    .populate("addfriendReq")
                    .populate("pendingReq")

                res.json({
                    type: "success", result: `Friend Removed`,
                    data: user
                })
            }
            else res.json({
                type: "failure", result: `You aren't friends with this user`
            });
        }
        catch (e) {
            console.log(e.message);
            res.json({
                type: "failure", result: `Can't Find the user or can't unfollow the user or user not found`
            });
        }
    }
    else res.json({
        type: "failure", result: `Server Error`
    });
}
const reportuser = async (req, res, next) => {
    const message = req.body.message;
    const id = mongoose.Types.ObjectId(req.body.id);
    const user = mongoose.Types.ObjectId(req.user);
    if (id === user) {
        return res.json({ type: "failure", result: "You can't report yourself!" })
    }
    try {
        const by = user;
        const reported = await User.findById(id);
        if (!reported)
            return res.json({
                type: "failure",
                result: "No user found"
            });
        const response = new ReportUser({ by, reported, message });
        response.save().then(e => {
            return res.json({ type: "success", result: "uesr reported" })
        }).catch(e => {
            return res.json({ type: "failure", result: "could not report user" })
        })
    }
    catch (e) {
        console.log(e.message);
        return res.json({ type: "failure", result: "could not report user" })
    }

}
const acceptfriend = async (req, res, next) => {
    if (req.body.id !== req.body.acceptid) {
        try {
            const acceptid = await User.findById(req.body.acceptid);
            const currentUser = await User.findById(req.body.id)
                .populate("friends")
                .populate("addfriendReq")
                .populate("pendingReq")
            if (!acceptid)
                res.json({
                    type: "failure",
                    result: "No user found"
                });
            if (acceptid.pendingReq.includes(req.body.id)) {

                await acceptid.updateOne({
                    $pull: { pendingReq: req.body.id }
                }, { new: true })
                await acceptid.updateOne({
                    $push: { friends: req.body.id }
                }, { new: true })
                await currentUser.updateOne({
                    $pull: { addfriendReq: req.body.acceptid }
                }, { new: true })
                await currentUser.updateOne({
                    $push: { friends: req.body.acceptid }
                }, { new: true })
                const user = await User.findById(req.body.id)
                    .populate("friends")
                    .populate("addfriendReq")
                    .populate("pendingReq")

                return res.json({
                    type: "success", result: `Friend Request Accpeted`,
                    data: user
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
module.exports = {
    reportuser,
    register,
    registerWithImage,
    UpdatePorfile,
    signin,
    Verify,
    OTP,
    verifyOTP,
    changePassword,
    updateStatus,
    DELETEUSER,
    getSingleUser,
    removefriend,
    follow,
    unfollow,
    acceptfriend
}




