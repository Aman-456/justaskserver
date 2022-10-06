const { json } = require("express")
const Posts = require("../modals/Posts")
const Comments = require("../modals/Comments")
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

// const GetAllPosts = async (req, res, next) => {
//     try {
//         const find = await Posts.find({}).sort({ createdAt: - 1 })
//         if (find) {
//             res.json({
//                 type: "success",
//                 result: find,
//                 user: req.user
//             });
//         }
//         else {
//             res.json({
//                 type: "failure",
//                 result: "server error"
//             });
//         }
//     }
//     catch (e) {
//         console.log(e);
//     }
// }
const GetSinglePost = async (req, res, next) => {
    try {
        const post = await Posts.findById(req.body.id)
            .populate('Author')
            .populate("Comments.Author")
            .populate("Comments.reply.Author")
        if (post) {
            return res.json({ type: "success", result: post })
        }
    }
    catch (e) {
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
const AddPostComment = async (req, res) => {
    try {
        var data = {
            Body: req.body.body,
            Author: req.body.user,
            Post: req.body.post
        };
        console.log(req.body);
        const post = await Posts.findByIdAndUpdate(
            req.body.post,
            { $push: { Comments: data } },
            { new: true }
        );
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
    try {
        var data = {
            Body: req.body.body,
            Author: req.body.user,
        };

        const post = await Posts.findOneAndUpdate(
            {
                Comments: { $elemMatch: { _id: req.body.post } }, //comment id
            },
            {
                $push: { "Comments.$.reply": data, },
            },
            { new: true }

        );
        console.log("reply", post);

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
        const role = req.body.userRole.toLowerCase();
        const postOrganizer = await PostOrganizer.findOneAndUpdate(
            {
                comments: { $elemMatch: { _id: req.body.id } },
            },
            {
                $set: {
                    "comments.$.comment": req.body.comment,
                },
            }
        );
        // console.log(postOrganizer);
        if (postOrganizer) {
            return res.status(200).json({
                type: "success",
                result: "Comment edited Successfully",
            });
        } else {
            const postPlayerResult = await PostPlayer.findOneAndUpdate(
                {
                    comments: { $elemMatch: { _id: req.body.id } },
                },
                {
                    $set: {
                        "comments.$.comment": req.body.comment,
                    },
                }
            );
            // console.log(postPlayerResult);
            if (!postPlayerResult) {
                return res
                    .status(500)
                    .json({ type: "failure", result: "Update Record error!" });
            }
            const data = await GetPosts();
            return res.status(200).json({
                type: "success",
                result: "Comment edited Successfully",
                data: data,
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
        const role = req.body.userRole.toLowerCase();
        const postOrganizer = await PostOrganizer.findOneAndUpdate(
            {
                "comments.reply": { $elemMatch: { _id: req.body.id } },
            },
            {
                $set: {
                    "comments.$[].reply.$[reply].comment": req.body.comment,
                },
            },
            {
                arrayFilters: [{ "reply._id": req.body.id }],
            }
        );
        console.log(postOrganizer);
        if (postOrganizer) {
            const data = await GetPosts();
            return res.status(200).json({
                type: "success",
                result: "Reply Edited Successfully",
                data: data,
            });
        } else {
            const postPlayerResult = await PostPlayer.findOneAndUpdate(
                {
                    "comments.reply": { $elemMatch: { _id: req.body.id } },
                },

                {
                    $set: {
                        "comments.$[].reply.$[reply].comment": req.body.comment,
                    },
                },
                {
                    arrayFilters: [{ "reply._id": req.body.id }],
                }
            );
            if (!postPlayerResult) {
                return res
                    .status(500)
                    .json({ type: "failure", result: "Update Record error!" });
            }
            const data = await GetPosts();
            return res.status(200).json({
                type: "success",
                result: "Reply Edited Successfully",
                data: data,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ type: "failure", result: "Server Not Responding" });
    }
};



const DeleteReplyCommentPost = async (req, res) => {
    try {
        console.log(req.body.id);
        const data = await GetPosts();
        const postOrganizer = await PostOrganizer.findOneAndUpdate(
            {
                "comments.reply": { $elemMatch: { _id: req.body.id } },
            },
            {
                $pull: {
                    "comments.$.reply": {
                        _id: req.body.id,
                    },
                },
            }
        );
        console.log(postOrganizer);
        if (postOrganizer) {
            return res.status(200).json({
                type: "success",
                result: "Reply Deleted Successfully",
            });
        } else {
            const postPlayerResult = await PostPlayer.findOneAndUpdate(
                {
                    "comments.reply": { $elemMatch: { _id: req.body.id } },
                },
                {
                    $pull: {
                        "comments.$.reply": {
                            _id: req.body.id,
                        },
                    },
                }
            );
            if (!postPlayerResult) {
                return res
                    .status(500)
                    .json({ type: "failure", result: "Update Record error!" });
            }
            const data = await GetPosts();
            return res.status(200).json({
                type: "success",
                result: "Reply Deleted Successfully",
                data: data,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ type: "failure", result: "Server Not Responding" });
    }
};

const DeleteCommentPost = async (req, res) => {
    try {
        console.log(req.body.id);

        const postOrganizer = await PostOrganizer.findOneAndUpdate(
            {
                comments: { $elemMatch: { _id: req.body.id } },
            },
            {
                $pull: {
                    comments: {
                        _id: req.body.id,
                    },
                },
            }
        );
        console.log(postOrganizer);
        if (postOrganizer) {
            return res.status(200).json({
                type: "success",
                result: "Comment Deleted Successfully",
            });
        } else {
            const postPlayerResult = await PostPlayer.findOneAndUpdate(
                {
                    comments: { $elemMatch: { _id: req.body.id } },
                },
                {
                    $pull: {
                        comments: {
                            _id: req.body.id,
                        },
                    },
                }
            );
            if (!postPlayerResult) {
                return res
                    .status(500)
                    .json({ type: "failure", result: "Update Record error!" });
            }
            const data = await GetPosts();
            return res.status(200).json({
                type: "success",
                result: "Comment Deleted Successfully",
                data: data,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ type: "failure", result: "Server Not Responding" });
    }
};

const LikePost = async (req, res) => {
    try {
        const post = await Posts.findOne({ _id: req.body.id });
        if (post) {
            console.log(req.user);

            const postr = await Posts.findOneAndUpdate(
                { _id: req.body.id },
                {
                    $push: {
                        Likes: {
                            Author: req.user,
                        },
                    },
                }
            );
            if (!postr) {
                res
                    .status(500)
                    .json({ type: "failure", result: "Update Record error!" });
            }
            const data = await Getall();
            return res.status(200).json({
                type: "success",
                result: "Likes Updated Successfully",
                data: data,
            });
        }
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ type: "failure", result: "Server not Responding. Try Again" });
    }
};
const UnLikePost = async (req, res) => {
    try {
        const post = await Posts.findOne({ _id: req.body.id });
        if (post) {
            console.log(req.user);

            const postr = await Posts.findOneAndUpdate(
                { _id: req.body.id },
                {
                    $pull: {
                        Likes: {
                            Author: req.user,
                        },
                    },
                }
            );
            if (!postr) {
                res
                    .status(500)
                    .json({ type: "failure", result: "Update Record error!" });
            }
            const data = await Getall();
            return res.status(200).json({
                type: "success",
                result: "Likes Updated Successfully",
                data: data,
            });
        }
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
    GetMyAnswers,
    GetMyTopics,
    EditCommentPost,
    EditReplyCommentPost,
    DeleteCommentPost,
    DeleteReplyCommentPost,
    LikePost,
    UnLikePost

}