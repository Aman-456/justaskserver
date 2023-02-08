const express = require("express");
const {
    accessChat,
    fetchChats,
    createGroupChat,
    removeFromGroup,
    addToGroup,
    renameGroup,
} = require("../controllers/chatControllers");
const { authenticator } = require("../middleware/authentication")

const router = express.Router();

router.post("/", authenticator, accessChat)
router.route("/").get(authenticator, fetchChats);
router.route("/group").post(authenticator, createGroupChat);
router.route("/rename").put(authenticator, renameGroup);
router.route("/groupremove").put(authenticator, removeFromGroup);
router.route("/groupadd").put(authenticator, addToGroup);

module.exports = router;