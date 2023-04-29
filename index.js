const express = require("express")
const app = express();
require("dotenv").config();
const cors = require("cors");
const database = require("./connect");
const bodyParser = require("body-parser")
const userRoute = require("./routes/users");
const postRoute = require("./routes/Posts");
const searchRoute = require("./routes/search")
const adminRoute = require("./routes/admin")


database();               // database connection
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}


app.use(cors(corsOptions)) // Use this after the variable declaration


app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true
}));

app.use(express.json());  // parses incoming api request with json payloads- middleware

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

app.use(function (req, res, next) {
    console.log("api: " + req.originalUrl);
    next();
});

app.use('/uploads', express.static('./uploads'));
app.use("/api/user", userRoute);
app.use('/api/post', postRoute);
app.use('/api/search', searchRoute);
app.use('/api/admin', adminRoute);



// app.use(morgan('dev'));




const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server running on PORT ${PORT}...`));



