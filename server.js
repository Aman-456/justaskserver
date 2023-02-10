const express = require("express")
const app = express();
require("dotenv").config();
const cors = require("cors");
const database = require("./connect");
const userRoute = require("./routes/users");
const postRoute = require("./routes/Posts");
const searchRoute = require("./routes/search")
const bodyParser = require("body-parser")

database();               // database connection
app.use(cors());          // for cross orign resource sharing

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    // res.header('Access-Control-Allow-Origin', "*")
    res.header('Access-Control-Allow-Headers', "*")

    next()
})
app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true
}));

app.use(express.json());  // parses incoming api request with json payloads- middleware


app.use('/uploads', express.static('uploads'));
app.use("/api/user", userRoute.routes);
app.use('/api/post', postRoute);
app.use('/api/search', searchRoute);

app.listen(process.env.PORT || 5000, () => { // listens to the port
    console.log("Backend is running at port " + process.env.PORT);
});


app.get('/', (req, res) => res.send("ok")); // for checking server
