
const router = require("express").Router();
const { CreatePost, AddPostComment, AddReply, GetAllPosts } = require("../controllers/postController")


router.post("/", CreatePost)
router.get("/", GetAllPosts)
router.post("/comment", AddPostComment)
router.post("/reply", AddReply)

module.exports = router