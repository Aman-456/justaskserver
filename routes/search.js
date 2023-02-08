const router = require("express").Router();
const Post = require("../modals/Posts")
const User = require("../modals/User")
const { cursewordscheck } = require("../middleware/cursewordscheck")

router.get('/', cursewordscheck, async (req, res) => {
    try {
        const { query, tags } = req.query;
        let posts, user;
        if (tags == 'false') {
            posts = await Post.find(query === "posts" ? {} : { $text: { $search: query } })
                .populate("Author");
        }
        else if (tags) {
            const t = query.split(" ")
            posts = await Post.find({ 'Tags': { '$in': t } }).populate("Author")
        }

        user = await User.find(query === "users" ? {} : { $text: { $search: query } })

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
