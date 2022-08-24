const mongoose = require("mongoose");

let database = () => {
    try {
        mongoose
            .connect(process.env.MONGO_URL)
            .then(() => console.log("DB Connection Successfull!"))
            .catch((err) => {
                console.log(err);
            });
    }
    catch (e) {
        console.log(e);
    }
}
module.exports = database