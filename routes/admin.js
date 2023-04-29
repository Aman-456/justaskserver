const router = require("express").Router();
const controllers = require("../controllers/adminController")
const middleware = require("../middleware/authentication")

router.post('/deleteuser',
    middleware.authenticator,
    controllers.DELETEUSERByAdmin
);
router.post('/deletepost',
    middleware.authenticator,
    controllers.DeletePostByAdmin
);

router.get('/users',
    controllers.GetAll
);
router.get('/reportedusers',
    controllers.reporteduserslist
);
router.get('/posts',
    controllers.GetAllPosts
);
router.get('/Admin_getreports',
    controllers.getContact
);
router.post('/Admin_postreports',
    controllers.Contact
);
router.get('/Admin_graphdata',
    controllers.GraphData
);
router.post('/completenotice',
    controllers.NoticeComplete
);

router.post('/completereported',
    controllers.ReportedComplete
);

module.exports = router
