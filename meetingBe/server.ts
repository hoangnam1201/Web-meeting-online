import express, { json, urlencoded, Express, Response, Request } from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { createServer } from "http";
import dotenv from "dotenv";
import initRouter from "./src/api/routers/index.router";
import { initIOServer } from "./src/io/index";
import { ExpressPeerServer } from "peer";

interface ExpressApp extends Express {
  io?: Server;
}

dotenv.config();
const PORT = process.env.PORT || 3000;
const app: ExpressApp = express();
const httpServer = createServer(app);

app.use((req: Request, res: Response, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(json());
app.use(urlencoded({ extended: false }));

const uri = process.env.HOST_DB || "mongodb://localhost:27017/meetingdb";
mongoose.connect(uri);

// socketjs
const io = new Server(httpServer, {
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
});
app.use("/peerjs", peerServer);

// api
app.io = io;
initRouter(app);

httpServer.listen(PORT, () => console.log("listen on port " + PORT));
