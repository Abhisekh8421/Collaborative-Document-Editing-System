import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import { connectdb } from "./db/user_db.js";
import Document from "./models/user_model.js";
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

connectdb();

app.get("/", (req, res) => {
  res.send("working nicely");
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173/",
    credentials: true,
  },
});
const defaultValue = {};

io.on("connection", (socket) => {
  // console.log("User Connected", socket.id); for debugging purpose
  socket.on("get-document", async (documentId) => {
    const document = await findorcreatedocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);
    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      try {
        if (!documentId) {
          console.error("DocumentId is not defined");
          return;
        }
        const document = await Document.findByIdAndUpdate(
          documentId,
          {
            $set: {
              data,
            },
          },
          {
            new: true,
          }
        );
        await document.save();
        socket.broadcast.to(documentId).emit("receive-changes", data);
      } catch (error) {
        console.error("Error saving document:", error.message);
      }
    });
  });

  const findorcreatedocument = async (id) => {
    if (!id) return;
    const document = await Document.findById(id);
    if (document) return document;
    return await Document.create({ _id: id, data: defaultValue });
  };

  socket.on("disconnect", () => {
    console.log(`${socket.id} is disconnected`);
  });
});

server.listen(3000, () => {
  console.log("server started");
});
