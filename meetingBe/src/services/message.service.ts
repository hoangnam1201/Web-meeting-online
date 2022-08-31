import messageModel from "../models/message.model";

export default () => {
  const create = async (
    sender: string,
    roomId: string,
    message: string,
    files: { fileId: string; name: string }[]
  ) => {
    const messageRead = await messageModel.create({
      sender,
      message,
      files,
      room: roomId,
    });
    return messageRead.populate("sender");
  };
  return { create };
};
