
const router = require("express").Router();
const {
    CreatePost,
    GetMyAnswers,
    GetOthersAnswers,
    GetSinglePost,
    EditPost,
    GetAllPosts,
    LikePost,
    UnLikePost,
    EditCommentPost,
    EditReplyCommentPost,
    DeleteCommentPost,
    DeleteReplyCommentPost,
    DeletePost,
    AddPostComment,
    AddReply,
    AddtoSavedPosts,
    RemoveFromSaved
} = require("../controllers/postController")
const middleware = require("../middleware/authentication")


router.post("/", middleware.authenticator, CreatePost)
router.get("/", GetAllPosts)

router.post("/singlepost", GetSinglePost)
router.get("/myanswers", middleware.authenticator, GetMyAnswers)
router.post("/otheranswers", middleware.authenticator, GetOthersAnswers)
router.post("/editpost", middleware.authenticator, EditPost)
router.post("/like", middleware.authenticator, LikePost)
router.post("/unlike", middleware.authenticator, UnLikePost)
router.post("/editcomment", middleware.authenticator, EditCommentPost)
router.post("/editreply", middleware.authenticator, EditReplyCommentPost)
router.post("/deletecomment", middleware.authenticator, DeleteCommentPost)
router.post("/deletereply", middleware.authenticator, DeleteReplyCommentPost)
router.post("/deletepost", middleware.authenticator, DeletePost)
router.post("/comment", middleware.authenticator, AddPostComment)
router.post("/reply", middleware.authenticator, AddReply)
router.post("/addtosave", middleware.authenticator, AddtoSavedPosts)
router.post("/removefromsave", middleware.authenticator, RemoveFromSaved)


module.exports = router