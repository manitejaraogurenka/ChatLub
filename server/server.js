import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import colors from "colors";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import errorHandlers from "./middleware/errorMiddleware.js";
import messageRoutes from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import bodyParser from "body-parser";

const app = express();
dotenv.config();
connectDB();
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

app.use(express.json());

const PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(errorHandlers.notFound);
app.use(errorHandlers.errorHandler);

const server = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`.yellow.bold)
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData.id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room:" + room);
  });
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined!");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});
