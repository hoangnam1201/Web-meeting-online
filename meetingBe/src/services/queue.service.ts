import queueModel from "../models/queue.model";
import roomModel from "../models/room.model";
import userModel from "../models/user.model";

export default () => {
  const getAll = () => {
    return queueModel.find();
  };

  const createQueues = (emails: string[], roomId: string) => {
    const queues = emails.map((e) => ({ email: e, room: roomId }));
    return queueModel.create(queues);
  };

  const deleteQueues = (email: string) => {
    return queueModel.deleteMany({ email: email });
  };

  const deleteQueuesByRoomId = (roomId: string) => {
    return queueModel.deleteMany({ room: roomId });
  };

  const executeQueue = async (email: string, userId: string) => {
    const queues = await queueModel.find({ email: email });
    const roomIds = queues.map((q) => q.room);
    await deleteQueues(email);
    await roomModel.updateMany(
      { _id: { $in: roomIds } },
      { $addToSet: { members: userId } }
    );
    return userModel.updateOne(
      { _id: userId },
      {
        $addToSet: {
          invitedRooms: { $each: roomIds },
        },
      }
    );
  };

  return {
    createQueues,
    deleteQueues,
    deleteQueuesByRoomId,
    executeQueue,
    getAll,
  };
};
