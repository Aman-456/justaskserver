const jwt = require("jsonwebtoken")

const authenticator = (req, res, next) => {
    const auth = req.headers.auth
    console.log("auth", auth);
    if (auth) {
        const token = auth.split(" ")[1]
        jwt.verify(token, process.env.SECRET_JWT, (err, user) => {
            if (err) {
                return res.json({
                    type: "unAuth",
                    result: "Invalid Token, login again to access information!"
                })
            }
            else next()
        })
    }
}

module.exports = { authenticator }