import mongoose from "mongoose";
import { ReadStream } from "fs";
import { GridFSBucket, ObjectId } from "mongodb";
import XLSX from "xlsx";
import { Readable } from "stream";
import * as fs from "fs";

XLSX.stream.set_readable(Readable);

let gridfsBucket: GridFSBucket;
mongoose.connection.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploadFiles",
  });
});

export default () => {
  const putFile = (name: string, data: Buffer) => {
    return new Promise<ObjectId>((resolve, reject) => {
      const writestream = gridfsBucket.openUploadStream(name);
      const readableStream = ReadStream.from(data);
      readableStream.pipe(writestream);

      writestream.on("finish", () => {
        resolve(writestream.id);
      });
      writestream.on("error", (error) => {
        reject(error);
      });
    });
  };

  const getStreamFile = (id: string) => {
    return gridfsBucket.openDownloadStream(new ObjectId(id));
  };

  const excelToJson = (data: Buffer) => {
    try {
      const workbook = XLSX.read(data, { type: "buffer" });
      const sheetNameList = workbook.SheetNames;
      let xldata: object[] = [];
      sheetNameList.forEach((sheetName) => {
        xldata = [
          ...XLSX.utils.sheet_to_json<Object>(workbook.Sheets[sheetName]),
          ...xldata,
        ];
      });
      return xldata;
    } catch {
      throw new Error("Internal Server Error");
    }
  };

  const jsonToExcel = (data: object[]) => {
    try {
      const workSheet = XLSX.utils.json_to_sheet(data);
      return XLSX.stream.to_csv(workSheet);
    } catch {
      throw new Error("Internal Server Error");
    }
  };

  const removeFile = (id: string) => {
    return gridfsBucket.delete(new ObjectId(id));
  };

  const findById = (id: string) => {
    return gridfsBucket.find({ _id: new ObjectId(id) });
  };
  return {
    putFile,
    getStreamFile,
    removeFile,
    findById,
    excelToJson,
    jsonToExcel,
  };
};
