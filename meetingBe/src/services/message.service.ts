import messageModel from "../models/message.model";

export default () => {
  const create = (
    sender: string,
    message: string,
    files: { fileId: string; name: string }[]
  ) => {
    return messageModel.create({ sender, message, files });
  };
  return { create };
};
