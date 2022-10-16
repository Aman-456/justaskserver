const upload = require('../middleware/multer')

const router = require("express").Router();
const controllers = require("../controllers/userController")
const middleware = require("../middleware/authentication")


router.post('/register', controllers.register);
router.post(
    '/registerWithImage',
    upload.single('file'),
    controllers.registerWithImage
);
router.post(
    '/updateprofile',
    middleware.authenticator,
    upload.single('file'),
    controllers.UpdatePorfile
);
router.post(
    '/signin',
    controllers.signin
);
router.post('/getSingleUser',
    middleware.authenticator,
    controllers.getSingleUser
);
router.put('/updateStatus',
    middleware.authenticator,
    controllers.updateStatus
);
router.put('/VerifyEmail',
    controllers.VerifyEmail
);
router.put('/updatePass',
    controllers.updatePass
);

router.put('/follow',
    middleware.authenticator,
    controllers.follow
);
router.put('/unfollow',
    middleware.authenticator,
    controllers.unfollow
);
router.delete('/removefriend',
    middleware.authenticator,
    controllers.removefriend
);
router.delete('/acceptfriend',
    middleware.authenticator,
    controllers.acceptfriend
);
router.post('/friendslist',
    middleware.authenticator,
    controllers.friendList
);
router.post('/pendinglist',
    middleware.authenticator,
    controllers.pendinglist
);
router.post('/requestlist',
    middleware.authenticator,
    controllers.friendrequest
);

router.delete('/delete',
    middleware.authenticator,
    controllers.DELETEUSER
);


exports.routes = router;