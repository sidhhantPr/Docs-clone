import { Server } from "socket.io";
import connectDB from "./database/db.js";
import express from "express";
import {
  getDocument,
  updateDocument,
} from "./controller/document-controller.js";

connectDB();

const io = new Server(9000, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("get-document", async (documentid) => {
    const document = await getDocument(documentid);
    socket.join(documentid);
    socket.emit("load-document", document.data);
    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentid).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await updateDocument(documentid, data);
      socket.broadcast.to(documentid).emit("saved-document");
    });
  });
});
