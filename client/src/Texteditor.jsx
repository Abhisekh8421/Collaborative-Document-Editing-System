import React, { useCallback, useEffect, useMemo, useState } from "react";
import Quill from "quill";
import { io } from "socket.io-client";
import "quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const Texteditor = () => {
  const { id: documentId } = useParams();
  const [quill, setQuill] = useState(null);
  const [socketid, setsocketid] = useState("");
  console.log(documentId);

  const socket = useMemo(() => {
    return io.connect("http://localhost:3000/", {
      transports: ["websocket"],
    });
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;
    quill.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });
    socket.emit("get-document", documentId);
  }, [socket, documentId, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);
    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    socket.on("connect", () => {
      setsocketid(socket.id);
      console.log("connected", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const wrapperRef = useCallback(
    (wrapper) => {
      if (wrapper == null || quill !== null) return;

      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);
      const q = new Quill(editor, {
        theme: "snow",
        modules: { toolbar: TOOLBAR_OPTIONS },
      });
      setQuill(q);
    },
    [quill]
  );

  return <div className="container" ref={wrapperRef}></div>;
};

export default Texteditor;
