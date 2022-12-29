const router = require("express").Router();
const controllers = require("../controllers/userController")
const middleware = require("../middleware/authentication")

router.delete('/user/delete',
    middleware.authenticator,
    controllers.DELETEUSERByAdmin
);

router.get('/users',
    controllers.GetAll
);
router.get('/reporteusers',
    controllers.reporteduserslist
);

router.post('/getSingleUserbyAdmin',
    controllers.getSingleUserbyAdmin
);

module.exports = router
