const mongoose = require("mongoose");

let database = () => {
    try {
        mongoose
            .connect("mongodb+srv://amanullah:Invalid_pass123@cluster0.jnbmy.mongodb.net/?retryWrites=true&w=majority")
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