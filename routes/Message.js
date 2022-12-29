const router = require("express").Router();
const controllers = require("../controllers/messageController")


router.post('/', controllers.addtomessages);
router.get('/:id', controllers.getMessages);



module.exports = router;