const User = require('../modals/User')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")
var fs = require("fs");
const path = require("path")
var handlebars = require("handlebars");


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
        const find = await User.findOne({ email })
        if (find) return res.json({
            type: "failure",
            result: "Email already exist"
        });
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            profile: req.body.file
        })
        sendEmail(user.email, user.name, user, res);
    }
    catch (e) {
        console.log(e);
        return res.json({ type: "failure", result: e.message })
    }
}

const UpdatePorfile = async (req, res, next) => {
    try {
        const find = await User.findByIdAndUpdate(
            req.user,
            { $set: { profile: req.file.path } },
            { new: true }
        )
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
                        await user.save().then(e => {
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
    user.password = req.body.password;
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
module.exports = {
    register,
    registerWithImage,
    UpdatePorfile,
    signin,
    Verify,
    OTP,
    verifyOTP,
    changePassword
}