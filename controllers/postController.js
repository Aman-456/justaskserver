const Posts = require("../modals/Posts")
const SavedPosts = require("../modals/SavedPosts")
const User = require("../modals/User")
const mongoose = require('mongoose')
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


const GetSinglePost = async (req, res, next) => {
    try {
        const post = await Posts.findById(req.body.id)
            .populate('Author')
            .populate("Comments.Author")
            .populate("Comments.reply.Author")
        console.log(post);
        if (post) {
            return res.json({ type: "success", result: post })
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
        ).populate("Author")
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
        ).populate("Author")
        if (p) {
            return res.json({ type: "success", result: p })
        }
    }
    catch (e) {
        console.log(e);
    }
}

const AddtoSavedPosts = async (req, res, next) => {
    try {

        console.log("here", req.body.id);
        const post = new SavedPosts({
            Author: req.user,
            Post: req.body.id
        })
        const a = await post.save()
        if (a) {
            return res.json({ type: "success", result: { ...a } })
        }
    }
    catch (e) {
        console.log(e);
    }
}


const GetMySavedPosts = async (req, res, next) => {
    try {
        var id = mongoose.Types.ObjectId(req.user);

        const posts = await SavedPosts.find({ Author: id });
        console.log(posts);
        if (posts) {
            return res.json({ type: "success", result: posts })
        }
    }
    catch (e) {
        console.log(e);
    }
}
const GetOthersSaved = async (req, res, next) => {
    try {
        var id = mongoose.Types.ObjectId(req.body.id);

        const posts = await SavedPosts.find({ Author: id });
        console.log(posts);
        if (posts) {
            return res.json({ type: "success", result: posts })
        }
    }
    catch (e) {
        console.log(e);
    }
}


const GetMyTopics = async (req, res, next) => {
    try {
        const p = await Posts.find({ Author: req.user }).populate("Author")
        if (p) {
            return res.json({ type: "success", result: p })
        }
    }
    catch (e) {
        console.log(e);
    }
}
const GetOthersTopics = async (req, res, next) => {
    try {
        const p = await Posts.find({ Author: req.body.id }).populate("Author")
        if (p) {
            return res.json({ type: "success", result: p })
        }
    }
    catch (e) {
        console.log(e);
    }
}

const Getall = async (req, res, next) => {
    try {
        const post = await Posts.find({})
            .populate('Author')
            .populate("Comments.Author")
            .populate("Comments.reply")
        return post
    }
    catch (e) {
        console.log(e);
    }
}
const GetAllPosts = async (req, res, next) => {
    try {
        const post = await Posts.find({})
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


const AddPostComment = async (req, res) => {
    try {
        var data = {
            Body: req.body.body,
            Author: req.user,
        };

        const post = await Posts.findByIdAndUpdate(
            req.body.id,
            { $push: { Comments: data } },
            { new: true }
        )
            .populate('Author')
            .populate("Comments.Author")
            .populate("Comments.reply.Author")
        console.log("post", req.body);
        if (!post) {


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
    try {
        var data = {
            Body: req.body.body,
            Author: req.user
        };
        console.log(req.user);
        const post = await Posts.findOneAndUpdate(
            {
                Comments: { $elemMatch: { _id: req.body.id } }, //comment id
            },
            {
                $push: { "Comments.$.reply": data, },
            },
            { new: true }

        )
            .populate('Author')
            .populate("Comments.Author")
            .populate("Comments.reply.Author")
        console.log(post);
        if (!post) {

            return res
                .status(500)
                .json({ type: "failure", result: "Server not Responding. Try Again" });
        }

        res.status(200).json({
            type: "success",
            result: "reply updated Successfully",
            data: post,
        });


    }
    catch (error) {
        console.log(error.message);
        res
            .status(500)
            .json({ type: "failure", result: "Server not Responding. Try Again" });
    }
};

const EditCommentPost = async (req, res) => {
    try {
        console.log(req.body.id);
        console.log(req.body);
        const post = await Posts.findOneAndUpdate(
            {
                Comments: { $elemMatch: { _id: req.body.id } },
            },
            {
                $set: {
                    "Comments.$.Body": req.body.body,
                },
            },
            {
                new: true
            }
        );
        // console.log(postOrganizer);
        if (post) {
            return res.status(200).json({
                type: "success",
                result: "Comment edited Successfully",
                data: post
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ type: "failure", result: "Server Not Responding" });
    }
};

const EditReplyCommentPost = async (req, res) => {
    try {
        console.log(req.body.id);
        const postOrganizer = await Posts.findOneAndUpdate(
            {
                "Comments.reply": { $elemMatch: { _id: req.body.id } },
            },
            {
                $set: {
                    "Comments.$[].reply.$[reply].Body": req.body.body,

                },

            },

            {
                arrayFilters: [{ "reply._id": req.body.id }],
                new: true
            },


        );
        console.log(postOrganizer);
        if (postOrganizer) {
            const data = await Getall();
            return res.status(200).json({
                type: "success",
                result: "Reply Edited Successfully",
                data: postOrganizer,
            });
        }
        else {
            return res.status(404).json({
                type: "failure",
                result: "Can't Find Comment",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ type: "failure", result: "Server Not Responding" });
    }
};



const DeleteReplyCommentPost = async (req, res) => {
    try {
        const post = await Posts.findOneAndUpdate(
            {
                "Comments.reply": { $elemMatch: { _id: req.body.id } },
            },
            {
                $pull: {
                    "Comments.$.reply": {
                        _id: req.body.id,
                    },
                }
            },
            {
                new: true
            }
        );
        console.log(post);
        if (post) {
            return res.status(200).json({
                type: "success",
                result: "Reply Deleted Successfully",
                data: post
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ type: "failure", result: "Server Not Responding" });
    }
};

const DeleteCommentPost = async (req, res) => {
    try {
        const post = await Posts.findOneAndUpdate(
            {
                Comments: { $elemMatch: { _id: req.body.id } },
            },
            {
                $pull: {
                    Comments: {
                        _id: req.body.id,
                    },
                },
            },
            {
                new: true
            }
        );
        if (post) {
            const p = Getall()
            return res.status(200).json({
                type: "success",
                result: "Comment Deleted Successfully",
                data: post
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ type: "failure", result: "Server Not Responding" });
    }
};

const DeletePost = async (req, res) => {
    try {
        console.log(req.body.id);

        const post = await Posts.findOneAndDelete({ _id: req.body.id });
        if (post) {
            return res.status(200).json({
                type: "success",
                result: "Post Deleted Successfully",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ type: "failure", result: "Server Not Responding" });
    }
};

const LikePost = async (req, res) => {
    try {
        let post

        if (req.body.type === "like") {
            post = await Posts.findOneAndUpdate(
                { _id: req.body.id },
                {
                    $inc: { 'Likes.count': 1 },
                    $addToSet: {
                        'Likes.liked': {
                            id: req.user,
                            type: "like"
                        }
                    }
                },
                { new: true }
            ).populate("Comments.Author")
                .populate("Comments.reply.Author")
                .populate('Author')
        }
        else if (req.body.type === "unlike") {
            post = await Posts.findOneAndUpdate(
                { _id: req.body.id },
                {
                    $inc: { 'Likes.count': -1 },
                    $pull: { 'Likes.liked': { id: req.user } }
                },
                { new: true }
            ).populate("Comments.Author")
                .populate("Comments.reply.Author")
                .populate('Author')

        }


        if (!post) {
            res
                .status(500)
                .json({ type: "failure", result: "Update Record error!" });
        }
        return res.status(200).json({
            type: "success",
            result: "Likes Updated Successfully",
            data: post,
        });

    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ type: "failure", result: "Server not Responding. Try Again" });
    }
};

const UnLikePost = async (req, res) => {
    try {
        let post = await Posts.find({ Likes: { $elemMatch: { id: req.user } } })

        if (post) {

            if (req.body.type === "like") {
                post = await Posts.findOneAndUpdate(
                    { _id: req.body.id },
                    {
                        $inc: { 'Likes.count': -1 },
                        $addToSet: { 'Likes.liked': { id: req.user, type: "unlike" } }
                    },
                    { new: true }
                ).populate("Comments.Author")
                    .populate("Comments.reply.Author")
                    .populate('Author')
            }
            else if (req.body.type === "unlike") {
                post = await Posts.findOneAndUpdate(
                    { _id: req.body.id },
                    {
                        $inc: { 'Likes.count': 1 },
                        $pull: { 'Likes.liked': { id: req.user, } }

                    },
                    { new: true }
                ).populate("Comments.Author")
                    .populate("Comments.reply.Author")
                    .populate('Author')

            }

        }
        else {
            post = await Posts.find({ _id: req.body.id })
                .populate('Author')
                .populate("Comments.Author")
                .populate("Comments.reply.Author")
        }
        if (!post) {
            res
                .status(500)
                .json({ type: "failure", result: "Update Record error!" });
        }
        return res.status(200).json({
            type: "success",
            result: "Likes Updated Successfully",
            data: post,
        });

    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ type: "failure", result: "Server not Responding. Try Again" });
    }
};
module.exports = {
    CreatePost,
    AddPostComment,
    AddReply,
    GetAllPosts,
    GetSinglePost,
    GetMySavedPosts,
    AddtoSavedPosts,
    GetMyAnswers,
    GetMyTopics,
    EditCommentPost,
    EditReplyCommentPost,
    DeleteCommentPost,
    DeleteReplyCommentPost,
    LikePost,
    UnLikePost,
    DeletePost,
    GetOthersAnswers,
    GetOthersSaved,
    GetOthersTopics
}