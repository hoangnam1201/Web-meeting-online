import { Request, Response, NextFunction } from "express";
import { FileRequest } from "../../interfaces/fileRequest";
export const checkXLSXFile = (
  req: FileRequest,
  res: Response,
  next: NextFunction
) => {
  const file = req.files?.importFile;
  if (!file)
    return res
      .status(400)
      .json({ status: 400, error: "import file is required" });
  if (
    file.mimetype !==
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
    return res.status(400).json({ status: 400, error: "invalied import file" });
  next();
};
