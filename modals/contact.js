const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const ContactSchema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        message: { type: String, required: true },
        completed: { default: false, type: Boolean }
    },
    { timestamps: true }
);

module.exports = mongoose.model("contact", ContactSchema);
