const router = require("express").Router();
const Post = require("../modals/Posts")
const User = require("../modals/User")
router.get('/', async (req, res) => {
    try {
        const { query } = req.query;
        console.log(query);
        let posts, user
        if (query.includes("tags:")) {
            const split = query.splice(5)
            const tags = split.split(" ")
            posts = await Post.find({
                Tags: { $in: tags }
            }).populate("Author")
        }
        else {
            posts = await Post.find(
                query === "posts" ? {} : { $text: { $search: query } }).populate("Author")
        }
        user = await User.find(
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
