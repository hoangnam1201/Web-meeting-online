import { Request, Response } from "express";
import mime from "mime";
import FileService from "../../services/file.service";

export default () => {
  const fileService = FileService();

  const downloadFile = async (req: Request, res: Response) => {
    const fileId = req.params.id;
    if (!fileId)
      return res
        .status(400)
        .json({ status: 400, msg: "id required in params" });
    const fileCursor = fileService.findById(fileId);
    const file = await fileCursor.next();
    if (!file) return res.status(404).json({ status: 400, msg: "not found" });
    res.setHeader(
      "Content-disposition",
      "attachment; filename=" + file.filename
    );
    res.setHeader("Content-type", mime.getType(file.filename));
    fileService.getStreamFile(fileId).pipe(res);
  };
  return { downloadFile };
};
