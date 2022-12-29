const express = require("express")
const app = express();
require("dotenv").config();
const cors = require("cors");
const database = require("./connect");
const userRoute = require("./routes/users");
const adminRoute = require("./routes/admin");
const postRoute = require("./routes/Posts");
const NewsLetterRoute = require("./routes/newsletter");
const searchRoute = require("./routes/search")
const conversation = require("./routes/Conversation")
const messages = require("./routes/Message")
const bodyParser = require("body-parser")

database();               // database connection
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}





app.use(cors(corsOptions)) // Use this after the variable declaration
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers: Content-Type, Authorization");
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


app.use('/uploads', express.static('./uploads'));
app.use("/api/user", userRoute);
app.use('/api/post', postRoute);
app.use('/api/search', searchRoute);
app.use('/api/newsletter', NewsLetterRoute);
app.use('/api/admin', adminRoute);
app.use('/api/conversation', conversation);
app.use('/api/messages', messages);

app.listen(process.env.PORT || 5000, () => { // listens to the port
    console.log("Backend is running at port " + process.env.PORT);
});


