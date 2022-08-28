const upload = require('../middleware/multer')

const router = require("express").Router();
const controllers = require("../controllers/userController")

router.post('/register', controllers.register);
router.post(
    '/registerWithImage',
    upload.single('file'),
    controllers.registerWithImage
);
router.post('/signin', controllers.signin);
router.post('/getSingleUser', controllers.getSingleUser);
router.put('/updateStatus', controllers.updateStatus);
router.put('/VerifyEmail', controllers.VerifyEmail);
router.put('/updatePass', controllers.updatePass);
router.delete('/delete', controllers.Delete);
router.put('/follow', controllers.follow);
router.put('/unfollow', controllers.unfollow);
router.delete('/removefriend', controllers.removefriend);
router.post('/friendslist', controllers.friendList);
exports.routes = router;