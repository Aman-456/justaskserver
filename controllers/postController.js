const Posts = require("../modals/Posts")
const User = require("../modals/User")
const Saved = require("../modals/SavedPosts")
const { default: mongoose } = require("mongoose")

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
        if (edit) {
            const saved = await Saved.findOne({
                Author: req.user,
                Post: req.body.id
            })

            res.json({
                type: "success",
                data: {
                    ...edit._doc,
                    saved: saved ? true : false
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
            const saved = await Saved.findOne({ Author: req.user, Post: req.body.id })

            return res.json({ type: "success", result: { ...post?._doc, saved: saved ? true : false } })
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
        const saved = await Saved.findOne({
            Author: req.user,
            Post: req.body.id
        })
        return res.status(200).json({
            type: "success",
            result: "Likes Updated Successfully",
            data: { ...post._doc, saved: saved ? true : false },
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
        const saved = await Saved.findOne({
            Author: req.user,
            Post: req.body.id
        })
        return res.status(200).json({
            type: "success",
            result: "Likes Updated Successfully",
            data: { ...post._doc, saved: saved ? true : false },
        });

    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ type: "failure", result: "Server not Responding. Try Again" });
    }
};

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
        if (!post) {


            return res
                .status(500)
                .json({ type: "failure", result: "Server not Responding. Try Again" });
        }
        const saved = await Saved.findOne({
            Author: req.user,
            Post: req.body.id
        })
        res.status(200).json({
            type: "success",
            result: "comment updated Successfully",
            data: { ...post._doc, saved: saved ? true : false },
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
        if (!post) {
            return res
                .status(500)
                .json({ type: "failure", result: "Server not Responding. Try Again" });
        }
        const saved = await Saved.findOne({
            Author: req.user,
            Post: req.body.id
        })
        res.status(200).json({
            type: "success",
            result: "reply updated Successfully",
            data: { ...post._doc, saved: saved ? true : false },
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
        ).populate('Author')
            .populate("Comments.Author")
            .populate("Comments.reply.Author")
        // console.log(postOrganizer);
        if (post) {
            const saved = await Saved.findOne({
                Author: req.user,
                Post: req.body.id
            })
            return res.status(200).json({
                type: "success",
                result: "Comment edited Successfully",
                data: { ...post._doc, saved: saved ? true : false },
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ type: "failure", result: "Server Not Responding" });
    }
};

const EditReplyCommentPost = async (req, res) => {
    try {
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

        ).populate('Author')
            .populate("Comments.Author")
            .populate("Comments.reply.Author")

        if (postOrganizer) {
            const saved = await Saved.findOne({
                Author: req.user,
                Post: req.body.id
            })
            return res.status(200).json({
                type: "success",
                result: "Reply Edited Successfully",
                data: { ...postOrganizer._doc, saved: saved ? true : false },
            })

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
        ).populate('Author')
            .populate("Comments.Author")
            .populate("Comments.reply.Author")
        if (post) {
            const saved = await Saved.findOne({
                Author: req.user,
                Post: req.body.id
            })
            return res.status(200).json({
                type: "success",
                result: "Reply Deleted Successfully",
                data: { ...post._doc, saved: saved ? true : false },
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
        )
            .populate("Comments.Author")
            .populate("Comments.reply.Author")
            .populate('Author')

        if (post) {
            const saved = await Saved.findOne({
                Author: req.user,
                Post: req.body.id
            })
            return res.status(200).json({
                type: "success",
                result: "Comment Deleted Successfully",
                data: { ...post._doc, saved: saved ? true : false },
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ type: "failure", result: "Server Not Responding" });
    }
};

const DeletePost = async (req, res) => {
    try {
        const post = await Posts.findOneAndDelete({ _id: req.body.id });
        if (post) {
            await Saved.findOneAndDelete({
                Author: req.user,
                Post: req.body.id
            })
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

const AddtoSavedPosts = async (req, res, next) => {
    try {
        const p = new Saved({
            Author: req.user,
            Post: req.body.id
        })
        const a = await p.save()
        if (a) {
            const post = await Posts.findOne({ _id: req.body.id }).populate("Author")
            return res.json({
                type: "success", data: { ...post?._doc, saved: true }
            })
        }
    }
    catch (e) {
        console.log(e);
    }
}

const RemoveFromSaved = async (req, res, next) => {
    try {
        const saved = await Saved.findOneAndDelete({ Post: req.body.id, Author: req.user })
        const post = await Posts.findOne({ _id: req.body.id }).populate("Author")
        if (saved) {
            return res.json({
                type: "success", data: { ...post._doc, saved: false }
            })
        }
    }
    catch (e) {
        console.log(e);
    }
}
const GetRecent = async (req, res, next) => {
    try {
        const post = await Posts.find({}, { _id: 1, Title: 1 }).sort({ $natural: -1 }).limit(7)
        if (post) {
            return res.json({ type: "success", result: post })
        }
    }
    catch (e) {
        console.log(e);
    }
}
const GetMyTopics = async (req, res, next) => {
    try {
        const p = await Posts.find({ Author: req.user }).sort({ $natural: -1 }).populate("Author")
        if (p) {
            return res.json({ type: "success", result: p })
        }
    }
    catch (e) {
        console.log(e);
    }
}
const GetMySavedPosts = async (req, res, next) => {
    try {
        var id = mongoose.Types.ObjectId(req.user);
        const posts = await Saved.find({ Author: id })
            .sort({ $natural: -1 })
            .populate('Post')
            .populate("Post Author")
            .populate({ path: "Post", populate: "Author" })

        const newposts = posts.map(e => e.Post)
        if (posts) {
            return res.json({ type: "success", result: newposts })
        }
    }
    catch (e) {
        console.log(e);
    }
}
const GetOthersTopics = async (req, res, next) => {
    try {
        const p = await Posts.find({ Author: req.body.id }).sort({ $natural: -1 }).populate("Author")
        if (p) {
            return res.json({ type: "success", result: p })
        }
    }
    catch (e) {
        console.log(e);
    }
}
module.exports = {
    GetMySavedPosts,
    GetMyTopics,
    GetRecent,
    CreatePost,
    GetSinglePost,
    GetMyAnswers,
    GetOthersAnswers,
    GetAllPosts,
    EditPost,
    LikePost,
    UnLikePost,
    AddPostComment,
    AddReply,
    EditCommentPost,
    EditReplyCommentPost,
    DeleteCommentPost,
    DeleteReplyCommentPost,
    EditPost,
    DeletePost,
    AddtoSavedPosts,
    RemoveFromSaved,
    GetOthersTopics,
}