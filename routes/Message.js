const router = require("express").Router();

const {
    allMessages,
    sendMessage,
} = require("../controllers/messageControllers");

const { authenticator } = require("../middleware/authentication")

router.route("/:chatId").get(authenticator, allMessages);
router.route("/").post(authenticator, sendMessage);



module.exports = router;
