const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReporteduserSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },
    message: { type: String },
    reporteduser: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },
},
    { timestamps: true }
)

const Reporteduser = mongoose.model('reportedusers', ReporteduserSchema)

module.exports = Reporteduser;