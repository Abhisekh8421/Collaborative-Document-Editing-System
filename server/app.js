import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173/",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("working nicely");
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173/",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // console.log("User Connected", socket.id); for debugging p
  socket.on("get-document", (documentId) => {
    const data = "";
    socket.join(documentId);
    socket.emit("load-document", data);
    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} is disconnected`);
  });
});

server.listen(3000, () => {
  console.log("server started");
});
