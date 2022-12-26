const NewsLetter = require('../modals/Newsletter')

const addTonewsletterlist = async (req, res, next) => {
    try {
        const { email } = req.body

        console.log(email);
        const checkuser = await NewsLetter.findOne({ email: email })
        if (checkuser)
            return res.json({
                type: "failure",
                result: "Email already exist"
            });
        await new NewsLetter({ user: req.user, email })
            .save()
            .then(e => {
                res.json({
                    type: "success",
                    result: "Added to NewsLetter"
                });
            })
            .catch(e => {
                res.json({ type: "failure", result: "server error" });
            })

    }
    catch (e) {
        console.log(e);
        return res.json({ type: "failure", result: e.message })
    }
}

const removefromnewsletterlist = async (req, res, next) => {
    try {
        const email = req.body.email
        const user = await NewsLetter.findOneAndDelete({ email });
        if (!user)
            return res.json({ type: "failure", result: "No user found" });
        console.log(user);
        res.json({
            type: "success", result: `Email has been removed `
        });
    }
    catch (e) {
        console.log(e);
        return res.json({ type: "failure", result: e.message });
    }
}

module.exports = {
    addTonewsletterlist,
    removefromnewsletterlist
}