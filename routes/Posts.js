
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
    RemoveFromSaved,
    GetRecent,
    GetMyTopics,
    GetMySavedPosts,
    GetOthersTopics
} = require("../controllers/postController");
const { reportuser } = require("../controllers/userController");
const middleware = require("../middleware/authentication")

router.get("/", GetAllPosts)
router.get("/recent", GetRecent)
router.post("/", middleware.authenticator, CreatePost)
router.post("/like", middleware.authenticator, LikePost)
router.post("/reply", middleware.authenticator, AddReply)
router.post("/editpost", middleware.authenticator, EditPost)
router.post("/unlike", middleware.authenticator, UnLikePost)
router.get("/mytopics", middleware.authenticator, GetMyTopics)
router.get("/saved", middleware.authenticator, GetMySavedPosts)
router.get("/myanswers", middleware.authenticator, GetMyAnswers)
router.post("/deletepost", middleware.authenticator, DeletePost)
router.post("/reportuser", middleware.authenticator, reportuser)
router.post("/comment", middleware.authenticator, AddPostComment)
router.post("/singlepost", middleware.authenticator, GetSinglePost)
router.post("/addtosave", middleware.authenticator, AddtoSavedPosts)
router.post("/othertopics", middleware.authenticator, GetOthersTopics)
router.post("/editcomment", middleware.authenticator, EditCommentPost)
router.post("/otheranswers", middleware.authenticator, GetOthersAnswers)
router.post("/otheranswers", middleware.authenticator, GetOthersAnswers)
router.post("/removefromsave", middleware.authenticator, RemoveFromSaved)
router.post("/editreply", middleware.authenticator, EditReplyCommentPost)
router.post("/deletecomment", middleware.authenticator, DeleteCommentPost)
router.post("/deletereply", middleware.authenticator, DeleteReplyCommentPost)

module.exports = router