import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Message from "./models/Message.js";

dotenv.config({ path: ".env.local" });

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("login", (userId) => {
    console.log(`User ${userId} logged in`);
    socket.join(userId);
  });

  socket.on("sendMessage", async (data) => {
    const { sender, receiver, message } = data;
    console.log(`Message from ${sender} to ${receiver}: ${message}`);

    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();

    io.to(receiver).emit("receiveMessage", {
      sender,
      receiver,
      message,
      timestamp: new Date(),
    });
    console.log("Message sent");
  });

  socket.on("fetchChatHistory", async (data) => {
    const { sender, receiver } = data;

    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort("timestamp");
    socket.emit("chatHistory", messages);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server is running on http://localhost:${PORT}`);
});
