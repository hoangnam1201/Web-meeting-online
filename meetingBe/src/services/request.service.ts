import requestModel, { Request } from "../models/request.model";

export default () => {
  const createRequest = async (request: Request) => {
    return (await requestModel.create(request)).populate("user");
  };

  const deleteRequests = (ids: string[]) => {
    return requestModel.deleteMany({ _id: { $in: ids } });
  };

  const getRequestInRoom = (roomId: string) => {
    return requestModel.find({ room: roomId }).populate("user");
  };
  return { createRequest, deleteRequests, getRequestInRoom };
};
