
const router = require("express").Router();
const {
    CreatePost,
    GetMyAnswers,
    GetOthersAnswers,
    GetSinglePost,
    EditPost,
    GetAllPosts
} = require("../controllers/postController")
const middleware = require("../middleware/authentication")


router.post("/", middleware.authenticator, CreatePost)
router.get("/", GetAllPosts)

router.post("/singlepost", GetSinglePost)
router.get("/myanswers", middleware.authenticator, GetMyAnswers)
router.post("/otheranswers", middleware.authenticator, GetOthersAnswers)
router.post("/editpost", middleware.authenticator, EditPost)


module.exports = router