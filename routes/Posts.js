
const router = require("express").Router();
const { CreateComment } = require("../controllers/commentsController")
const {
    CreatePost,
    AddPostComment,
    AddReply,
    GetAllPosts,
    LikePost,
    UnLikePost,
    GetMyAnswers,
    GetMyTopics,
    GetOthersAnswers,
    GetOthersSaved,
    GetOthersTopics,
    GetSinglePost,
    GetMySavedPosts,
    AddtoSavedPosts,
    EditCommentPost,
    EditReplyCommentPost,
    DeleteCommentPost,
    DeleteReplyCommentPost
} = require("../controllers/postController")
const middleware = require("../middleware/authentication")


router.post("/", middleware.authenticator, CreatePost)
router.get("/", GetAllPosts)

router.post("/singlepost", GetSinglePost)
router.get("/myanswers", middleware.authenticator, GetMyAnswers)
router.post("/otheranswers", middleware.authenticator, GetOthersAnswers)
router.get("/mytopics", middleware.authenticator, GetMyTopics)
router.post("/othertopics", middleware.authenticator, GetOthersTopics)
router.get("/saved", middleware.authenticator, GetMySavedPosts)
router.post("/otherssaved", middleware.authenticator, GetOthersSaved)
router.get("/addtosave", middleware.authenticator, AddtoSavedPosts)
router.post("/editcomment", middleware.authenticator, EditCommentPost)
router.post("/editreply", middleware.authenticator, EditReplyCommentPost)
router.post("/deletecomment", middleware.authenticator, DeleteCommentPost)
router.post("/deletereply", middleware.authenticator, DeleteReplyCommentPost)
router.post("/comment", middleware.authenticator, AddPostComment)
router.post("/reply", middleware.authenticator, AddReply)
router.post("/like", middleware.authenticator, LikePost)
router.post("/unlike", middleware.authenticator, UnLikePost)

module.exports = router