import { Router } from "express";
import FileController from "../controllers/file.controller";

const fileRouter = Router();
const fileController = FileController();

fileRouter.get("/download/:id", fileController.downloadFile);

export default fileRouter;
