const jwt = require("jsonwebtoken");

const authenticator = async (req, res, next) => {


    const auth = req.headers.authorization || req.headers.auth
    const token = auth.split(" ")[1]
    var obj = null
    try {
        obj = jwt.verify(token, process.env.SECRET_JWT)


    }
    catch (e) {
        return res.json({ type: "failure", data: obj || e, result: "You are not authorixed" })
    }
    if (token !== null && token && token !== undefined) {
        const { id } = jwt.verify(token, process.env.SECRET_JWT)
        console.log("id", id);
        if (id) {
            req.user = id
        }
        next()
        // return res.json({ type: "failure", result: "You are not authorixed" })

    }
    else {
        return res.json({ type: "failure", result: "You are not authorixed" })
    }
}

module.exports = { authenticator }