const router = require("express").Router();
const controllers = require("../controllers/newlettercontroller")
const middleware = require("../middleware/authentication")


router.post('/addTonewsletterlist', controllers.addTonewsletterlist);

router.delete('/removefromnewsletterlist',
    // middleware.authenticator,
    controllers.removefromnewsletterlist
);
module.exports = router;