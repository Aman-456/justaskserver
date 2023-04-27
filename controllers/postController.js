const Posts = require("../modals/Posts")
const User = require("../modals/User")

const CreatePost = async (req, res, next) => {
    try {
        const id = req.body.Author
        const find = await User.findById(id)
        console.log(find);
        if (!find) {
            return res.json({
                type: "failure",
                result: "No user found"
            });
        }

        const post = new Posts({
            Author: id,
            Title: req.body.Title,
            Body: req.body.Body,
            Tags: req.body.Tags
        })
        const save = await post.save();
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

const EditPost = async (req, res, next) => {
    try {
        console.log({
            Title: req.body.Title,
            Body: req.body.Body,
            Tags: req.body.Tags
        });
        const edit = await Posts.findByIdAndUpdate(
            req.body.id,
            {
                $set: {
                    Title: req.body.Title,
                    Body: req.body.Body,
                    Tags: req.body.Tags

                }
            },
            { new: true }
        )
            .populate('Author')
            .populate("Comments.Author")
            .populate("Comments.reply.Author")


        // const saved = await SavedPosts.findOne({
        //     Post: req.body.id,
        //     Author: req.user
        // })
        if (edit) {
            res.json({
                type: "success",
                data: {
                    ...edit._doc,
                    // saved
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
        console.log(e.message);
    }
}

const GetSinglePost = async (req, res, next) => {
    try {

        const post = await Posts.findById(req.body.id)
            .populate('Author')
            .populate("Comments.Author")
            .populate("Comments.reply.Author")

        if (post) {
            return res.json({ type: "success", result: { ...post?._doc } })
        }
    }
    catch (e) {
    }
}

const GetMyAnswers = async (req, res, next) => {
    try {

        const p = await Posts.find(
            {
                Comments: { $elemMatch: { Author: req.user } }, //comment id
            },
        ).sort({ $natural: -1 }).populate("Author")
        if (p) {
            return res.json({ type: "success", result: p })
        }
    }
    catch (e) {
        console.log(e);
    }
}
const GetOthersAnswers = async (req, res, next) => {
    try {
        console.log("This is quer", req.body);
        const p = await Posts.find(
            {
                Comments: { $elemMatch: { Author: req.body.id } }, //comment id
            },
        ).sort({ $natural: -1 }).populate("Author")
        if (p) {
            return res.json({ type: "success", result: p })
        }
    }
    catch (e) {
        console.log(e);
    }
}
const GetAllPosts = async (req, res, next) => {
    try {
        const post = await Posts.find({}).sort({ $natural: -1 })
            .populate('Author')
            .populate("Comments.Author")
            .populate("Comments.reply.Author")
        if (post) {
            return res.json({ type: "success", result: post })
        }
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = {
    CreatePost,

    GetSinglePost,

    GetMyAnswers,

    GetOthersAnswers,
    GetAllPosts,
    EditPost
}