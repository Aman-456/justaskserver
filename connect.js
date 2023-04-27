const mongoose = require("mongoose");

let database = () => {
    try {
        mongoose
            .connect(process.env.MONGO_URL, { useNewUrlParser: true })
            .then(() => console.log("DB Connection Successfull!"))
            .catch((err) => {
                console.log(err);
            });
    }
    catch (e) {
        // console.log(e);
        console.log("DataBase Connection Error");
    }
}
module.exports = database