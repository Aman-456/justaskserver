const multer = require('multer')
const fs = require('fs');

const destination = "uploads/profiles";

// Create destination directory if it doesn't exist
if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
}
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, destination);
    },
    filename: function (req, file, cb) {
        var filename = Date.now() + "-" + file.originalname;
        req.body.file = destination + "/" + filename;
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });
module.exports = upload