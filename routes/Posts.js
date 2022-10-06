
const router = require("express").Router();
const { CreatePost, AddPostComment, AddReply, GetAllPosts, LikePost, UnLikePost } = require("../controllers/postController")
const { CreateComment } = require("../controllers/commentsController")
const middleware = require("../middleware/authentication")


router.post("/", middleware.authenticator, CreatePost)
router.get("/", middleware.authenticator, GetAllPosts)
router.post("/comment", middleware.authenticator, AddPostComment)
router.post("/reply", middleware.authenticator, AddReply)
router.post("/like", middleware.authenticator, LikePost)
router.post("/unlike", middleware.authenticator, UnLikePost)

module.exports = router