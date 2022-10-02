const Comments = require("../modals/Comments")
const Post = require('../modals/Posts')

const CreateComment = async (req, res, next) => {
    try {
        const post = req.body.Post
        const find = await Post.findById(post)
        if (!find) {
            return res.json({
                type: "failure",
                result: "No Post found"
            });
        }

        const p = Post.findOneAndUpdate({ _id: post, })
        const save = await p.save();
        if (save) {
            res.json({
                type: "success",
                result: save
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

module.exports = { CreateComment }