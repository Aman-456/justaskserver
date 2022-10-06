
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
    GetSinglePost
} = require("../controllers/postController")
const middleware = require("../middleware/authentication")


router.post("/", middleware.authenticator, CreatePost)
router.get("/", middleware.authenticator, GetAllPosts)

router.post("/singlepost", middleware.authenticator, GetSinglePost)
router.get("/myanswers", middleware.authenticator, GetMyAnswers)
router.get("/mytopics", middleware.authenticator, GetMyTopics)
router.post("/comment", middleware.authenticator, AddPostComment)
router.post("/reply", middleware.authenticator, AddReply)
router.post("/like", middleware.authenticator, LikePost)
router.post("/unlike", middleware.authenticator, UnLikePost)

module.exports = router