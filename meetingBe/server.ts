import express, { json, urlencoded, Express, Response, Request } from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { createServer } from "http";
import dotenv from "dotenv";
import initRouter from "./src/api/routers/index.router";
import { initIOServer } from "./src/io/index";
import { ExpressPeerServer } from "peer";
import fileUpload from "express-fileupload";
import tooBusy from "toobusy-js";
import cors from "cors";

interface ExpressApp extends Express {
  io?: Server;
}

dotenv.config();
const PORT = process.env.PORT || 3000;
const SOCKET_PORT = process.env.SOCKET_PORT || 3001;
const app: ExpressApp = express();
const httpServer = createServer(app);

app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(fileUpload());
app.use(json());
app.use(urlencoded({ extended: false }));

const uri = process.env.HOST_DB || "mongodb://localhost:27017/meetingdb";
mongoose.connect(uri);

// socketjs
const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 1e8,
});
initIOServer(io);

// peerjs
const peerServer = ExpressPeerServer(httpServer, {
  path: "/meeting",
  proxied: "true",
});
app.use("/peerjs", peerServer);

// api
app.io = io;
app.use((req, res, next) => {
  if (tooBusy()) {
    res.status(503).json({ msg: "Server is busy right now" });
    return;
  }
  next();
});
initRouter(app);

app.get("/api/test", (req, res) => {
  res.status(403).json({ a: "a" });
});

//socket listent
io.listen(parseInt(SOCKET_PORT.toString()));
//server listent
httpServer.listen(PORT, () => console.log("listen on port " + PORT));
