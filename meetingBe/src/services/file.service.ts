import mongoose from "mongoose";
import { ReadStream } from "fs";
import { GridFSBucket, ObjectId } from "mongodb";
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

  const removeFile = (id: string) => {
    return gridfsBucket.delete(new ObjectId(id));
  };

  const findById = (id: string) => {
    return gridfsBucket.find({ _id: new ObjectId(id) });
  };
  return { putFile, getStreamFile, removeFile, findById };
};
