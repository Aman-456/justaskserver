const jwt = require("jsonwebtoken");

const authenticator = async (req, res, next) => {


    const auth = req.headers.authorization || req.headers.auth
    const token = auth.split(" ")[1]
    if (token !== null && token && token !== undefined) {
        const { id } = jwt.verify(token, process.env.SECRET_JWT)
        if (id) {
            req.user = id
        }
        next()
    }
    else {
        return res.json({ type: "failure", result: "You are not authorixed" })
    }
}

module.exports = { authenticator }