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





module.exports = router
