const Conversation = require('../modals/Conversation')

const addtoconversation = async (req, res, next) => {
    try {

        let find = false
        if (find)
            return res.json({ type: "false", result: "conversatinon already created" })

        new Conversation({
            members: [req.body.senderId, req.body.receiverId]
        })
            .save()
            .then(e => {
                res.json({ type: "success", result: e })
            })
            .catch(e => {
                res.json({ type: "failure", result: e })
            })

    }
    catch (e) {
        console.log(e);
        return res.json({ type: "failure", result: e.message })
    }
}

const getConversations = async (req, res, next) => {
    try {

        const email = req.params.id
        Conversation.find({
            members: { $in: [email] }
        })
            .populate("members")
            .then(e => {
                res.json({ type: "success", result: e });
            }).catch(e => {
                return res.json({ type: "failure", result: e });
            })

    }
    catch (e) {
        console.log(e);
        return res.json({ type: "failure", result: e });
    }
}

module.exports = {
    addtoconversation,
    getConversations
}