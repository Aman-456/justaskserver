const jwt = require("jsonwebtoken")

const authenticator = (req, res, next) => {
    const auth = req.headers.auth
    console.log("auth", auth);
    if (auth) {
        const token = auth.split(" ")[1]
        jwt.verify(token, process.env.SECRET_JWT, (err, user) => {
            if (err) {
                return res.status(403).json("Token is not valid!")
            }
            else next()
        })
    }
}

module.exports = { authenticator }