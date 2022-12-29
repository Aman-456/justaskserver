const router = require("express").Router();
const Posts = require("./Posts")
const controllers = require("../controllers/ConversatinoController")


router.post('/', controllers.addtoconversation);
router.get('/:id', controllers.getConversations);
module.exports = router;