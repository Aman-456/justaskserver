const router = require("express").Router();
const Post = require("../modals/Posts")
const User = require("../modals/User")

router.get('/', async (req, res) => {
    try {
        const { query, tags } = req.query;
        let posts = [], user = [];
        if (tags) {
            const t = query.split(" ")
            posts = await Post.find({ 'Tags': { '$in': t } }).populate("Author")
        }
        if (tags == 'null') {
            user = await User.find({ $text: { $search: query } })
            posts = await Post.find({ $text: { $search: query } })
                .populate("Author");
        }
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
