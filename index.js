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
const chatRoutes = require("./routes/chatroutes")
const messageRoutes = require("./routes/Message")
const bodyParser = require("body-parser")

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
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers: Content-Type, Authorization");
    res.header('Access-Control-Allow-Headers', "*")

    next()
})

app.use('/uploads', express.static('./uploads'));
app.use("/api/user", userRoute);
app.use('/api/post', postRoute);
app.use('/api/search', searchRoute);
app.use('/api/newsletter', NewsLetterRoute);
app.use('/api/admin', adminRoute);

app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


const PORT = process.env.PORT;

const server = app.listen(PORT, console.log(`Server running on PORT ${PORT}...`));



const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
        // credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved, a) => {
        var chat = newMessageRecieved.chat;
        console.log(a);
        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {

            if (user._id !== newMessageRecieved.sender._id) {
                console.log("sender", newMessageRecieved.sender.name);
                console.log("rece ", user?.name);
                socket.to(a).emit("message recieved", newMessageRecieved);
            }
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});