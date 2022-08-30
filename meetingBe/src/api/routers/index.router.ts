import { Express } from "express";
import authRoute from "./auth.router";
import userRoute from "./user.router";
import roomRoute from "./room.router";
import tableRoute from "./table.router";
import fileRouter from "./file.router";

const initRouter = (app: Express) => {
  app.use("/api/auth", authRoute);
  app.use("/api/user", userRoute);
  app.use("/api/room", roomRoute);
  app.use("/api/table", tableRoute);
  app.use("/api/file", fileRouter);
};

export default initRouter;
