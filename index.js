const express = require("express")
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const database = require("./connect");
const userRoute = require("./routes/users");
const postRoute = require("./routes/Posts");
const path = require('path')

dotenv.config();          // loads variable from .env file
database();               // database connection
app.use(cors());          // for cross orign resource sharing
app.use(express.json());  // parses incoming api request with json payloads- middleware

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*")
    res.header('Access-Control-Allow-Headers', "*")
    next()
})
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, "../../client/build")));
app.use("/api/user", userRoute.routes);
app.use('/api/post', postRoute);

app.listen(process.env.PORT || 5000, () => { // listens to the port
    console.log("Backend is running at port " + process.env.PORT);
});


app.get('/', (req, res) => res.send("ok")); // for checking server


const { Server } = require("socket.io");

const io = new Server({
    cors: {
        origin: "http://localhost:3000"
    }
});

// io.on("connection", (socket) => {
//     console.log("socket connected");
//     io.emit("firstEvent", "Hello this is test")
//     socket.on("disconnect", () => {
//         console.log("someone left");
//     })
// });

io.listen(3000);