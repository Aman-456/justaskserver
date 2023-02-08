const { words } = require("./data")

module.exports.cursewordscheck = (req, res, next) => {
    try {
        const { query } = req.query;
        const t = query.split(" ")
        let found = false
        t.forEach(element => {
            words.find(e => {
                if (element === e) {
                    found = true;
                    return
                }
            })

        });
        if (found) {
            return res.json({ type: "failure", result: "Don't use curse words" })
        }
        else next()

    }
    catch (e) {

    }
}