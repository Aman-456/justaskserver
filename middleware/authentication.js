const jwt = require("jsonwebtoken");

const authenticator = async (req, res, next) => {

    const auth = req.headers.authorization || req.headers.auth
    if (auth) {
        const token = auth.split(" ")[1]
        const { id } = jwt.verify(token, process.env.SECRET_JWT)
        if (id) {
            req.user = id
        }
        else {
            return res.json({ type: "unAuth", result: "You are not authorixed" })
        }
        next()
    }
    else {
        return res.json({ type: "failure", result: "You are not authorixed" })
    }
}

module.exports = { authenticator }