import requestModel, { Request } from "../models/request.model";

export default () => {
  const createRequest = async (request: Request) => {
    await requestModel.deleteOne({
      user: request.user,
      roomId: request.roomId,
    });
    return (await requestModel.create(request)).populate({
      path: "user",
      select: {
        _id: 1,
        username: 1,
        name: 1,
        email: 1,
      },
    });
  };

  const deleteRequests = (ids: string[]) => {
    return requestModel.deleteMany({ _id: { $in: ids } });
  };

  const getByIds = (ids: string[]) => {
    return requestModel.find({ _id: { $in: ids } });
  };

  const getRequestInRoom = (roomId: string) => {
    return requestModel.find({ room: roomId }).populate("user");
  };
  return { createRequest, deleteRequests, getRequestInRoom, getByIds };
};
