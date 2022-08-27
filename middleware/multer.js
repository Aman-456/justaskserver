const multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/profiles");
    },
    filename: function (req, file, cb) {
        var filename = Date.now() + "-" + file.originalname;
        req.body.file = "uploads/profiles" + filename;
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });
module.exports = upload