const upload = require('../middleware/multer')

const router = require("express").Router();
const controllers = require("../controllers/userController")
const middleware = require("../middleware/authentication")


router.post('/register', controllers.register);
router.post(
    '/registerWithImage',
    upload.single('image'),
    controllers.registerWithImage
);
router.put('/updateStatus',
    middleware.authenticator,
    controllers.updateStatus
);
router.post(
    '/updateprofile',
    middleware.authenticator,
    upload.single('image'),
    controllers.UpdatePorfile
);
router.post('/signin', controllers.signin);
router.get("/verify", controllers.Verify);
router.post("/otpsend", controllers.OTP);
router.post("/verifyotp", controllers.verifyOTP);
router.post("/passwordchange", controllers.changePassword);

router.post('/delete',
    middleware.authenticator,
    controllers.DELETEUSER
);
router.post('/getSingleUser',
    middleware.authenticator,
    controllers.getSingleUser
);
router.put('/follow',
    middleware.authenticator,
    controllers.follow
);
router.put('/unfollow',
    middleware.authenticator,
    controllers.unfollow
);

router.post('/reportuser',
    middleware.authenticator,
    controllers.reportuser
);

router.post('/removefriend',
    middleware.authenticator,
    controllers.removefriend
);
router.post('/acceptfriend',
    middleware.authenticator,
    controllers.acceptfriend
);
module.exports = router
