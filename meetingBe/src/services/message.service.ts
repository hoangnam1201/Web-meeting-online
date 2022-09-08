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

  const getMessages = (room: string, take: number, skip: number) => {
    return messageModel
      .find({ room: room })
      .populate("sender")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(take);
  };
  return { create, getMessages };
};
