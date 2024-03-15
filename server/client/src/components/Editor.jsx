import React, { useEffect, useState } from "react";

import Quill from "quill";

import "react-quill/dist/quill.snow.css";

import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
const Editor = () => {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  const { id } = useParams();

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],

    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],

    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],

    ["clean"],
  ];

  useEffect(() => {
    const quillInstance = new Quill("#editor", {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    quillInstance.disable();
    quillInstance.setText("wait loading document...");
    setQuill(quillInstance);
  }, []);

  useEffect(() => {
    const socketServer = io("");

    setSocket(socketServer);

    return () => {
      socketServer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta, oldDelta, source) => {
      if (source === "user") socket && socket.emit("send-changes", delta);
    };

    quill && quill.on("text-change", handler);

    return () => {
      quill && quill.off("text-change", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta) => {
      quill.updateContents(delta);
    };

    socket && socket.on("receive-changes", handler);

    return () => {
      socket && socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (quill == null || socket == null) return;

    socket.once("load-document", (document) => {
      quill && quill.setContents(document);
      quill && quill.enable();
    });
    socket && socket.emit("get-document", id);
  }, [quill, socket, id]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const interval = setInterval(() => {
      socket && socket.emit("save-document", quill.getContents());
    }, 2000);
    return () => clearInterval(interval);
  }, [socket, quill, id]);

  return (
    <div className="w-3/4 m-auto h-screen p-1 relative">
      <div id="editor" className="bg-blue-100 fixed w-3/4"></div>
    </div>
  );
};

export default Editor;
