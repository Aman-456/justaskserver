const router = require("express").Router();
const Post = require("../modals/Posts")
const User = require("../modals/User")
router.get('/', async (req, res) => {
    try {
        const { query } = req.query;
        console.log(query);
        const posts = await Post.find(
            query === "posts" ? {} : { $text: { $search: query } }).populate("Author")
        const user = await User.find(
            query === "users" ? {}
                : { $text: { $search: query } }
        )

        res.json({
            result: {
                users: user,
                posts: posts
            }
        });
    }
    catch (err) {
        console.log(err.message);
        res.json({ type: "failure", result: err.message })
    }

})

module.exports = router
