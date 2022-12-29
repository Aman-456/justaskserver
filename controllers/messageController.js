const Message = require('../modals/Message')


const addtomessages = async (req, res, next) => {
    try {
        new Message(req.body)
            .save()
            .then(e => res.json({ type: "success", result: e }))
            .catch(e => res.json({ type: "failure", result: e }))
    }
    catch (e) {
        console.log(e);
        return res.json({ type: "failure", result: e.message })
    }
}

const getMessages = async (req, res, next) => {
    try {
        const id = req.params.id
        Message.find({ conversationId: id })
            .then(e => { res.json({ type: "success", result: e }); })
            .catch(e => { return res.json({ type: "failure", result: e }); })
    }
    catch (e) {
        console.log(e);
        return res.json({ type: "failure", result: e });
    }
}

module.exports = {
    addtomessages,
    getMessages
}