const multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        var filename = Date.now() + "-" + file.originalname;
        req.body.file = "uploads" + filename;
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });
module.exports = upload