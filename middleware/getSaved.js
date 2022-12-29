const SavedPosts = require("../modals/SavedPosts")

const getSaved = async (req, res) => {
    try {
        const saved = await SavedPosts.findOne({ Post: req.body.id })
        if (saved) {
            req.saved = saved
        }
        return
    }
    catch (e) {
        res.json({ type: "failure", result: "error" })
    }
}
module.exports = { getSaved }