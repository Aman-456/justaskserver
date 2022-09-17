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
            Author: find,
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

const GetAllPosts = async (req, res, next) => {
    try {
        const find = await Posts.find({}).sort({ createdAt: - 1 })
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
    }
}

const AddPostComment = async (req, res) => {
    try {
        var data = {
            body: req.body.body,
            user: req.body.user,
        };


        const post = await Posts.findOneAndUpdate(
            { _id: req.body.id },
            { $push: { Comments: data } },
        );
        console.log("post", post);

        if (!post) {
            console.log("post", post);

            return res
                .status(500)
                .json({ type: "failure", result: "Server not Responding. Try Again" });
        }

        res.status(200).json({
            type: "success",
            result: "comment updated Successfully",
            data: post,
        });
    } catch (error) {
        res
            .status(500)
            .json({ type: "failure", result: "Server not Responding. Try Again" });
    }
};

const AddReply = async (req, res) => {
    const postid = req.body.id;
    const commentid = req.body.commentid
    try {
        var data = {
            body: req.body.body,
            user: req.body.user,
        };

        const post = await Posts.findById(postid)
        if (post) {
            post.Comments
        }
        // const post = await Posts.findOneAndUpdate(
        //     { _id: req.body.id },
        //     { $push: { Comments: data } },
        // );
        // console.log("post", post);

        if (!post) {
            // console.log("post", post);

            return res
                .status(500)
                .json({ type: "failure", result: "Server not Responding. Try Again" });
        }

        res.status(200).json({
            type: "success",
            result: "reply updated Successfully",
            data: post,
        });
    } catch (error) {
        res
            .status(500)
            .json({ type: "failure", result: "Server not Responding. Try Again" });
    }
};

module.exports = {
    CreatePost,
    AddPostComment,
    AddReply,
    GetAllPosts
}